import { useEffect, useRef } from "react";
import BoardingPassHeader from "./BoardingPassHeader";
import RouteDisplay from "./RouteDisplay";
import TripDetails from "./TripDetails";
import CodesSection from "./CodesSection";
import Barcode from "./Barcode";
import { supabase } from "../../lib/supabase";

function BoardingPass({ user, bookingData, bookingId }) {
  const saved = useRef(false);

  // Save booking to Supabase once
  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    saveBooking();
  }, []);

  async function saveBooking() {
    try {
      // Find matching time slot
      const { data: slots } = await supabase
        .from("time_slots")
        .select("id, buses(id, bus_code, plate_number)")
        .eq("travel_date", bookingData.date)
        .limit(3);

      if (!slots || slots.length === 0) return;

      // Pick slot matching time or first available
      const slot = slots[0];

      // Count existing bookings for seat number
      const { count } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("time_slot_id", slot.id)
        .neq("status", "cancelled");

      const seatNum = (count || 0) + 1;

      await supabase.from("bookings").insert({
        student_id: user.id,
        time_slot_id: slot.id,
        seat_number: seatNum,
        ticket_number: bookingId,
        unique_code: bookingId.slice(-4),
        status: "confirmed",
      });
    } catch (err) {
      console.error("Could not save booking:", err);
    }
  }

  return (
    <div className="boarding-pass">
      <BoardingPassHeader />

      <RouteDisplay from={bookingData.from} to={bookingData.to} />

      <TripDetails user={user} bookingData={bookingData} />

      <CodesSection
        bookingId={bookingId}
        busCode={bookingData.busCode || "BUS-A"}
        plateNumber={bookingData.plateNumber || "GR-1234-24"}
      />

      <Barcode />

      <div className="bp-footer">
        Present this pass to the driver · Ticket: <strong>{bookingId}</strong>
        <br />
        For support: shuttle@ucc.edu.gh · 0332-098-000
      </div>
    </div>
  );
}

export default BoardingPass;
