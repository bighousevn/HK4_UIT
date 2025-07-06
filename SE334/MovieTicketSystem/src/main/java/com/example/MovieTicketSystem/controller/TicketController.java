package com.example.MovieTicketSystem.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.MovieTicketSystem.model.Movie;
import com.example.MovieTicketSystem.model.Seat;
import com.example.MovieTicketSystem.repository.SeatRepository;
import com.example.MovieTicketSystem.service.TicketService;

import jakarta.servlet.http.HttpSession;

@Controller
public class TicketController {
    private final SeatRepository seatRepo = new SeatRepository(10); // Giả sử có 10 ghế
    private final TicketService ticketService = new TicketService();
    private final Movie movie = new Movie("Avengers", "Action", 100);
    @GetMapping("/")
    public String index(Model model, HttpSession session) {
        model.addAttribute("seats", seatRepo.getSeats());
        model.addAttribute("movie", movie);
        model.addAttribute("sessionId", session.getId()); // 👈 vẫn giữ sessionId
        return "index";
    }
    

    @PostMapping("/reserve")
    public String reserveSeat(
        @RequestParam(required = false) Integer seatNumber,
        @RequestParam(required = false) Integer cancelSeat,
        HttpSession session,
        RedirectAttributes redirectAttributes
    ) {
        String sessionId = session.getId(); // giữ sessionId
    
        if (seatNumber != null) {
            Seat seat = seatRepo.getSeat(seatNumber);
            boolean success = ticketService.reserveSeat(seat, sessionId);
            redirectAttributes.addFlashAttribute("message",
                success ? "Đặt vé thành công cho ghế số " + seatNumber :
                          "Ghế đã được đặt."
            );
        }
    
        if (cancelSeat != null) {
            Seat seat = seatRepo.getSeat(cancelSeat);
            boolean success = ticketService.cancelSeat(seat, sessionId);
            redirectAttributes.addFlashAttribute("message",
                success ? "Huỷ vé thành công." :
                          "Bạn không thể huỷ vé này."
            );
        }
    
        // 👇 PRG pattern
        return "redirect:/";
    }

    
}