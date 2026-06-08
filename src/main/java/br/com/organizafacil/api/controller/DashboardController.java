package br.com.organizafacil.api.controller;

import br.com.organizafacil.api.dto.DashboardDTO;
import br.com.organizafacil.api.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/{usuarioId}")
    public ResponseEntity<DashboardDTO> gerarDashboard(@PathVariable Long usuarioId) {
        try {
            DashboardDTO dto = dashboardService.gerarDashboard(usuarioId);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}