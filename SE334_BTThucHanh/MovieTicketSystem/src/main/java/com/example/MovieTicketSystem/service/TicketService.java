package com.example.MovieTicketSystem.service;

import java.util.concurrent.locks.ReentrantLock;

import com.example.MovieTicketSystem.model.Seat;

public class TicketService {
    private final ReentrantLock lock = new ReentrantLock();
    public boolean reserveSeat(Seat seat, String userId) {
        lock.lock();
        try {
            if (seat.isAvailable()) {
                seat.reserve(userId);
                return true;
            }
            return false;
        } finally {
            lock.unlock();
        }
    }

    public boolean cancelSeat(Seat seat, String userId) {
        lock.lock();
        try {
            return seat.cancel(userId);
        } finally {
            lock.unlock();
        }
    }
}