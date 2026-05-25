[![GitHub release](https://img.shields.io/github/v/release/wellingtonpragidi/Rise)]()
[![License](https://img.shields.io/github/license/wellingtonpragidi/Rise)]()
# Rise
Biblioteca Rise: Requisição assíncrona estilo AJAX do jQuery, muito leve com fade effects, formulários e JSON. Vanilla JS, sem dependências. MIT license.

## Instalação
Adicione o arquivo JS ao seu projeto:  

```html
<script src="assets/js/rise-ajax.js"></script>
<!-- codigo compactado -->
<script src="assets/js/rise-ajax.min.js"></script>
```
## Como Usar
1. Requisições HTTP (***`Rise`***`.request`)
```javascript
// Enviar JSON (Content-Type automatico)
Rise.request({
    url: 'api.php',
    method: 'POST',
    data: { action: 'update', id: 42 },
    success: (res) => {
        const resposta = JSON.parse(res); // Converte resposta JSON
        console.log('Sucesso:', resposta);
    },
    error: (err) => {
        console.error('Erro:', err);
    }
});
```
2. Formulários (***`Rise`***`.form`)
```javascript
// Formulario tradicional (FormData)
Rise.form('#myForm', {
    success: (res) => alert('Enviado!')
});

// Formulario com JSON
Rise.form('#loginForm', {
    contentType: 'application/json',
    success: (res) => {
    const data = JSON.parse(res);
        if( data.token ) {
            localStorage.setItem('token', data.token);
        }
    }
});
```
3. Efeitos Visuais
```javascript
// Aparecer/Desaparecer
Rise
  .appear('#result', 500) // Duração em ms
  .disappear('#result', 3000);

// Trocar classes
Rise.swapClass('.btn', 'hidden', 'active');
```
4. Limpar Formulários
```javascript
Rise.form('#cadastre', {
    success: () => {
        Rise.clearFields(); // Limpa os campos após envio
    }
});
```
### FAQ (Problemas Comuns)
1. Erro SyntaxError: JSON.parse
**Causa:**  
O servidor não retornou JSON válido (ex: erro PHP com mensagem HTML).  
Falta do header Content-Type: application/json no backend.  

**Solução:**
```php
// No PHP (garanta que so retorne JSON)
header('Content-Type: application/json');
http_response_code(200);
echo json_encode(['data' => $dados]);
exit; // Impede saidas acidentais
```
2. Campos não estão sendo enviados
**Causa:**
Inputs sem atributo `name`, atributo `name` sem valor ou valor incorreto.  
**Correção:**  
```html
<input type="text" name="users" />
```
3. `clearFields()` não funciona
**Causa:**  
O formulário não foi registrado com ***`Rise`***`.form`.  

**Solução:**  
```javascript
Rise.form('#myForm'); // Registra o formulário primeiro
// ... depois:
Rise.clearFields();
```
### Métodos Disponíveis
<table>
    <tr>
        <th>Método</th>
        <th>Uso</th>
    </tr>
    <tr>
        <td><code>request(options)</code></td>
        <td>Requisições HTTP customizadas</td>
    </tr>
        <td><code>form(selector, options)</code></td>
        <td>Gerencia formulários</td>
    </tr>
    <tr>
        <td><code>appear(selector, duration)</code></td>
        <td>Mostra elemento com fade-in</td>
    </tr>
        <td><code>disappear(selector, duration)</code></td>
        <td>Esconde elemento com fade-out</td>
    </tr>
    </tr>
        <td><code>swapClass(selector, oldClass, newClass)</code></td>
        <td>Troca classes CSS</td>
    </tr>
    </tr>
        <td><code>clearFields()</code></td>
        <td>Limpa campos do formulário enviado</td>
    </tr>
</table>

**Limitações**  
Método `swapClass` não suporta IE11 (usa `classList`).
Para uploads de arquivo, use `FormData` sem `contentType: 'application/json'`.

### Exemplo Completo (PHP + JS)
Backend (api.php):  
```php
header('Content-Type: application/json');
$data = ['status' => 'success', 'message' => 'Dados recebidos'];
echo json_encode( $data );
```
Frontend:  
```javascript
Rise.request({
  url: 'api.php',
  method: 'POST',
  data: { nome: 'Wellington' },
  success: (res) => {
    const data = JSON.parse(res);
    Rise.appear('#alert').swapClass('#alert', 'hidden', 'success');
  }
});
```
### Links Úteis
Documentação [***`XMLHttpRequest`***](https://developer.mozilla.org/pt-BR/docs/Web/API/XMLHttpRequest)
Exemplos de [***`FormData`***](https://javascript.info/formdata)
