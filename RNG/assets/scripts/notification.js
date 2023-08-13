/* Box para avisos e alertas */
const notificatioon = (typeAviso, msg, span, close, action = '') => { /* Type pode ser: success, attention ou error */
    // Variaveis locais
    let background = '';
    let contTime = (msg.split(' ').length)*1000;

    span = span != undefined || span != null ? span : '';

    if(typeAviso == 'error'){
        background = '#EE4444';
        className = 'colorWhite';
    }else if(typeAviso == 'success'){
        background = '#00CC83';
        className = 'colorWhite';
    }else if(typeAviso == 'attention'){
        background = '#faba39';
        className = 'nothingIcon';
    }

    Toastify({
        text: `${msg} ${span}`,
        duration: contTime,
        className: className,
        destination: action,
        // newWindow: true,
        close: close,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: background,
        }
    }).showToast();
}