package com.example.MovieTicketSystem.model;

import java.util.concurrent.atomic.AtomicBoolean;

public class Seat {
    private int seatNumber;
    private AtomicBoolean isAvailable;
    private AtomicBoolean cancelTicket;
    private String reservedBy; 


    public Seat(int seatNumber) {
        this.seatNumber = seatNumber;
        this.isAvailable = new AtomicBoolean(true); // Mặc định ghế trống
        this.cancelTicket = new AtomicBoolean(true);
        this.reservedBy = null;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public boolean isAvailable() {
        return isAvailable.get();
    }
    public boolean isCancel() {
        return cancelTicket.get();
    }

    public String getReservedBy() {
        return reservedBy;
    }
    public void reserve(String userId) {
        isAvailable.set(false);
        cancelTicket.set(false);
        reservedBy = userId;
    }

   
    public boolean cancel(String userId) {
        if (userId.equals(reservedBy)) {
            isAvailable.set(true);
            cancelTicket.set(true);
            reservedBy = null;
            return true;
        }
        return false;
    }
}