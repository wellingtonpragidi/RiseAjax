/**
 * RISE AJAX - Biblioteca moderna para requisiçoes HTTP e manipulaçao de DOM
 * @author Wellington Pragidi
 * @version 1.0
 * @license MIT
 */
const Rise = {
    /**
    * Armazena a referência do ultimo formulario manipulado
    * @type {HTMLFormElement|null}
    */
    _lastForm: null,

    /**
    * Manipula requisiçoes HTTP (GET, POST, etc.)
    * @param {Object} options - Configuraçoes da requisiçao
    * @param {string} options.url - URL do endpoint
    * @param {string} [options.method='GET'] - Metodo HTTP
    * @param {*} [options.data] - Dados a serem enviados
    * @param {string} [options.contentType] - Tipo de conteudo (auto-detectado se nao informado)
    * @param {Object} [options.headers] - Headers adicionais
    * @param {Function} [options.before] - Callback pre-envio
    * @param {Function} [options.success] - Callback de sucesso
    * @param {Function} [options.error] - Callback de erro
    * @param {Function} [options.complete] - Callback pós-requisiçao
    */
    request: function(options) {
        const xhr = new XMLHttpRequest;
        if( ! options.url ) {
            console.error('URL nao definida');
            return;
        }
        xhr.open( options.method || 'GET', options.url, true );

        // 1. Define os dados e detecta o Content-Type automaticamente
        let data = options.data;
        let contentType = options.contentType || null;

        // 2. Detecçao automatica se contentType nao foi especificado
        if( ! contentType ) {
            if( data instanceof FormData ) {
                contentType = 'multipart/form-data'; // Para formularios com arquivos
            } 
            else if( typeof data === 'object' ) {
                contentType = 'application/json';
                data = JSON.stringify(data); // Converte objeto para JSON
            } 
            else if( typeof data === 'string' && data.includes('=') ) {
                contentType = 'application/x-www-form-urlencoded';
            }
            // else { nao define header (sera o padrao do XHR) }
        }

        // 3. Aplica o header se necessario
        if( contentType ) {
            xhr.setRequestHeader('Content-Type', contentType);
        }

        // 4. Aplica headers adicionais se especificados
        if( options.headers ) {
            for( const [key, value] of Object.entries(options.headers) ) {
                xhr.setRequestHeader(key, value);
            }
        }

        //----- Callbacks -----//
        xhr.addEventListener('load', function() {
            if( xhr.status >= 200 && xhr.status < 300 ) {
                if( options.success ) {
                    options.success(xhr.responseText);
                }
            } 
            else {
                if( options.error ) {
                    options.error(xhr.statusText);
                }
            }
            if( options.complete ) {
                options.complete();
            }
        });

        xhr.send(data);
    },

    /**
    * Gerencia envio de formularios com suporte a multiplos formatos
    * @param {string} selector - Seletor CSS do formulario
    * @param {Object} options - Configuraçoes
    * @param {string} [options.contentType] - Tipo de conteudo (json/form-data/x-www-form-urlencoded)
    */
    form: function(selector, options) {
        const form = document.querySelector(selector);
        if( ! form ) {
            return console.error('Form nao encontrado:', selector);
        }

        this._lastForm = form;

        form.addEventListener('submit', (e) => {
            if( options.preventDefault !== false ) {
                e.preventDefault();
            }
            // Determina o tipo de dados a ser enviado
            const formData = new FormData(form);
            let data;
            let contentType = options.contentType || null;
            if( contentType === 'application/json') {
                data = Object.fromEntries(formData); // Converte FormData para objeto
            } 
            else if( contentType === 'multipart/form-data') {
                data = formData; // Mantem como FormData
            } 
            else {
                // Padrao: application/x-www-form-urlencoded
                data = new URLSearchParams(formData).toString();
                contentType = 'application/x-www-form-urlencoded';
            }
            this.request({
                url: options.url || form.action,
                method: options.method || form.method || 'POST',
                data,
                contentType, // Passa o contentType para o request
                headers: options.headers, // Headers adicionais
                before: options.before,
                success: options.success,
                error: options.error,
                complete: options.complete
            });
        });
    },

    //----- Limpa campos do ultimo form usado -----//
    clearFields: function() {
        if( ! this._lastForm ) {
            console.warn('Nenhum formulario foi registrado. Use Rise.form() primeiro.');
            return;
        }
        let formElement = this._lastForm.querySelectorAll('input, textarea, select');
        formElement.forEach( field => {
            if( field.type === 'checkbox' || field.type === 'radio' ) {
                field.checked = false;
            }
            else if( field.tagName === 'SELECT' ) {
                field.selectedIndex = 0;
            }
            else {
                field.value = '';
            }
        });
    }, 


    //----- Auxiliar: Verifica se elemento existe -----//
    getElement: (selector) => {
        const element = ( typeof selector === 'string' ) 
        ? document.querySelector(selector) 
        : selector;
        if( ! element ) {
            console.error('Elemento nao encontrado:', selector);
        }
        return element;
    },

    //----- Efeitos Visuais (agora com verificacao) -----//
    appear: function(selector, duration = 1000) {
        const element = this.getElement(selector);
        if( ! element ) {
            return;
        }
        element.style.opacity = '0';
        element.style.display = 'block';
        let start = null;

        const animate = (timestamp) => {
            if( ! start ) {
                start = timestamp;
            }
            const elapsed = timestamp - start;
            element.style.opacity = Math.min(elapsed / duration, 1);
            if( elapsed < duration ) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
        return this;
    },

    disappear: function(selector, duration = 1000) {
        const element = this.getElement(selector);
        if( ! element ) {
            return;
        }
        let start = null;
        const animate = (timestamp) => {
            if( ! start ) start = timestamp;
            const elapsed = timestamp - start;
            element.style.opacity = Math.max( 1 - elapsed / duration, 0 );
            if( elapsed < duration ) {
                requestAnimationFrame(animate);
            }
            else {
                element.style.display = 'none';
            }
        };

        requestAnimationFrame(animate);
        return this;
    },

    swapClass: function(selector, oldClass, newClass) {
        const element = this.getElement(selector);
        if( ! element || ! element.classList ) {
            return;
        }
        element.classList.remove(oldClass);
        element.classList.add(newClass);
    }
};
