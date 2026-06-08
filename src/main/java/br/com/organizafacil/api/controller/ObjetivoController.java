package br.com.organizafacil.api.controller;

import br.com.organizafacil.api.model.Objetivo;
import br.com.organizafacil.api.service.ObjetivoService;
import br.com.organizafacil.api.model.Despesa;
import br.com.organizafacil.api.service.DespesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/objetivos")
@CrossOrigin(origins = "*")
public class ObjetivoController {

    @Autowired
    private ObjetivoService objetivoService;

    @Autowired
    private DespesaService despesaService;

    @GetMapping
    public ResponseEntity<List<Objetivo>> listarTodos() {
        return ResponseEntity.ok(objetivoService.listarTodos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Objetivo>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(objetivoService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/prioridade/{prioridade}")
    public ResponseEntity<List<Objetivo>> listarPorPrioridade(@PathVariable Long usuarioId,
                                                              @PathVariable String prioridade){
        return ResponseEntity.ok(objetivoService.listarPorPrioridade(usuarioId, prioridade));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Objetivo> buscarPorId(@PathVariable Long id) {
        return objetivoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Objetivo objetivo) {
        try {
            Objetivo salvo = objetivoService.salvar(objetivo);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/criar-de-divida/{despesaId}")
    public ResponseEntity<?> criarObjetivoDeDivida(@PathVariable Long despesaId) {
        try {
            Despesa despesa = despesaService.buscarPorId(despesaId)
                    .orElseThrow(() -> new RuntimeException("Despesa não encontrada!"));
            Objetivo salvo = objetivoService.criarObjetivoDeDivida(despesa);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @RequestBody Objetivo objetivo) {
        try {
            Objetivo atualizado = objetivoService.atualizar(id, objetivo);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            objetivoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}