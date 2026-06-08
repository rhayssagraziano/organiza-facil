package br.com.organizafacil.api.controller;

import br.com.organizafacil.api.model.Despesa;
import br.com.organizafacil.api.service.DespesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/despesas")
@CrossOrigin(origins = "*")
public class DespesaController {

    @Autowired
    private DespesaService despesaService;

    @GetMapping
    public ResponseEntity<List<Despesa>> listarTodos() {
        return ResponseEntity.ok(despesaService.listarTodos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Despesa>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(despesaService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/tipo/{tipo}")
    public ResponseEntity<List<Despesa>> listaPorTipo(@PathVariable Long usuarioId,
                                                      @PathVariable String tipo) {
        return ResponseEntity.ok(despesaService.listarPorTipo(usuarioId, tipo));
    }

    @GetMapping("/usuario/{usuarioId}/parcelas")
    public ResponseEntity<List<Despesa>> listarParcelas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(despesaService.listarParcelas(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Despesa> buscarPorId(@PathVariable Long id) {
        return despesaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Despesa despesa) {
        try {
            Despesa salva = despesaService.salvar(despesa);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @RequestBody Despesa despesa) {
        try {
            Despesa atualizada = despesaService.atualizar(id, despesa);
            return ResponseEntity.ok(atualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            despesaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/plano-quitacao/{usuarioId}")
    public ResponseEntity<String> planoQuitacao(@PathVariable Long usuarioId,
                                                @RequestParam BigDecimal valorDisponivel) {
        return ResponseEntity.ok(despesaService.gerarPlanoQuitacao(usuarioId, valorDisponivel));
    }


}
