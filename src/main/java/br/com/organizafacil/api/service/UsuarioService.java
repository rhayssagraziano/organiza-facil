package br.com.organizafacil.api.service;

import br.com.organizafacil.api.model.Usuario;
import br.com.organizafacil.api.repository.UsuarioRepository;
import br.com.organizafacil.api.repository.ReceitaRepository;
import br.com.organizafacil.api.repository.DespesaRepository;
import br.com.organizafacil.api.repository.ObjetivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private DespesaRepository despesaRepository;

    @Autowired
    private ObjetivoRepository objetivoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id){
        return usuarioRepository.findById(id);
    }


    public Usuario salvar(Usuario usuario){
        //Regra para verificar se o email ja existe
        Optional<Usuario> existente = usuarioRepository.findByEmail(usuario.getEmail());
        if(existente.isPresent()){
            throw new RuntimeException("E-mail já cadastrado!");
        }
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }
    public Usuario atualizar(Long id, java.util.Map<String, String> dados){
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        if (dados.containsKey("nome") && !dados.get("nome").isBlank())
            usuario.setNome(dados.get("nome"));

        if (dados.containsKey("email") && !dados.get("email").isBlank())
            usuario.setEmail(dados.get("email"));

        if (dados.containsKey("fotoUrl"))
            usuario.setFotoUrl(dados.get("fotoUrl"));

        if (dados.containsKey("novaSenha") && !dados.get("novaSenha").isBlank()) {
            String senhaAtual = dados.get("senhaAtual");
            if (senhaAtual == null || !passwordEncoder.matches(senhaAtual, usuario.getSenha()))
                throw new RuntimeException("Senha atual incorreta!");
            if (dados.get("novaSenha").length() < 6)
                throw new RuntimeException("A nova senha deve ter pelo menos 6 caracteres.");
            usuario.setSenha(passwordEncoder.encode(dados.get("novaSenha")));
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario loginComGoogle(String accessToken) {
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setBearerAuth(accessToken);
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            org.springframework.http.ResponseEntity<java.util.Map> response = restTemplate.exchange(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                org.springframework.http.HttpMethod.GET, entity, java.util.Map.class
            );
            java.util.Map<String, Object> info = response.getBody();
            String email   = (String) info.get("email");
            String nome    = (String) info.get("name");
            String fotoUrl = (String) info.get("picture");

            Optional<Usuario> existente = usuarioRepository.findByEmail(email);
            if (existente.isPresent()) {
                Usuario u = existente.get();
                if (fotoUrl != null) { u.setFotoUrl(fotoUrl); usuarioRepository.save(u); }
                return u;
            }
            Usuario novo = new Usuario();
            novo.setNome(nome);
            novo.setEmail(email);
            novo.setFotoUrl(fotoUrl);
            novo.setSenha(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            return usuarioRepository.save(novo);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao autenticar com Google: " + e.getMessage());
        }
    }

    public Usuario login(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas!"));
        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas!");
        }
        return usuario;
    }

    @Transactional
    public void deletar(Long id){
        // Remove child records first to avoid FK constraint violations.
        // Do this even if the user row is missing (partial-delete recovery).
        receitaRepository.deleteAllByUsuarioId(id);
        despesaRepository.deleteAllByUsuarioId(id);
        objetivoRepository.deleteAllByUsuarioId(id);

        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
        }
    }
}
