package controller;

import com.sun.net.httpserver.HttpExchange;
import model.User;
import service.AuthService;

import java.util.Optional;

public abstract class BaseController {
    protected final AuthService authService;

    public BaseController(AuthService authService) {
        this.authService = authService;
    }

    protected Optional<User> authenticate(HttpExchange exchange) {
        String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            return authService.authenticate(token);
        }
        return Optional.empty();
    }
}
