/* Constantes a da logica */
const generatedNumbers = []; // Array dos números já gerados

const containerNumber = $('.contain-number-wrapper'); // Container dos números gerados 
const inputStartNumber = $('#start-number'); // Input do número inicial
const inputEndNumber = $('#end-number'); // Input do número final
const btnGeneratorNumbers = $('.add-new-number'); // Botão para gerar os números
const btnRemoveNumbers = $('.remove-all-number'); // Botão para resetar os números gerados
var isFunctionRunning = false; // Variável de controle para verificar se a função está em execução

// Verificando informações salvas
(async function uploadInformation(){
    var RNGenerator = await JSON.parse(localStorage.getItem('RNGenerator'));

    if(RNGenerator !== null){
        if(RNGenerator.startNumber >= 0 && RNGenerator.endNumber > 0){
            containerNumber.removeClass('remove');
            btnRemoveNumbers.addClass('active'); // Adicionando o botão de Remover todos os números gerados

            // Colocando as informações de geração e desabilitando os inputs
            inputStartNumber.val(RNGenerator.startNumber);
            inputEndNumber.val(RNGenerator.endNumber);
            inputStartNumber.parent('.inputs-single').addClass('disabled');
            inputStartNumber.prop('disabled', true);
            inputEndNumber.parent('.inputs-single').addClass('disabled');
            inputEndNumber.prop('disabled', true);

            let localNG = RNGenerator.generatedNumbers;

            if(localNG.length > 0){

                for(let i = 0; i < localNG.length; i++){ // Rodado loop dos números gerados para adicionar ao container dos números
                    generatedNumbers.push(localNG[i]); // Colocando os números na Const principal deles

                    await containerNumber.append(containNumberGenerete(localNG[i])); // Pegando o container dos números

                    containerNumber.slideDown(100, function(){
                        setTimeout(()=>{
                            containerNumber.find('.single-number:nth-child('+(i+1)+')').removeClass('preview');
                        }, 500+((i)*100));
                    });

                }

                if(generatedNumbers.length == (inputEndNumber.val() - inputStartNumber.val())){ // Desabilitando o Botão de gerar mais caso a quantidade gerar seja o suficiente
                    btnGeneratorNumbers.prop('disabled', true); // Desativando o Botão de gerar mais
                }
            }else{
                noResultLoad();
            }
        }else{
            noResultLoad();
        }
    }else{
        noResultLoad();
    }

    function noResultLoad(){
        containerNumber.append(NoResult()); // Informando que não há números gerados

        containerNumber.slideDown(100, function(){
            containerNumber.removeClass('remove');
        });
    }
}());

// Funções constantes
const getRandom = max => { /* Função para gerar os números aleatórios */
    return Math.floor(Math.random() * max + 1);
}
const newContainNumber = number => { /* Função para adicionar novo número gerado na tela */
    containerNumber.append(containNumberGenerete(number)); // Pegando o container dos números

    // let containNumber = containNumberGenerete(number).appendTo(containerNumber)
    containerNumber.slideToggle(300, function(){

        containerNumber.find('.single-number:last-child').removeClass('preview');

        var loadNumber = setInterval(() => { // Colocando uma contagem para geração de números
            containerNumber.find('.single-number:last-child p').html(Math.floor(Math.random() * parseInt(inputEndNumber.val()) + 1));
        }, 50);

        setTimeout(() => {
            clearInterval(loadNumber); // Removendo a contagem
            containerNumber.find('.single-number:last-child p').html(number); // Informando o número já escolhido

            btnGeneratorNumbers.prop('disabled', false);
            isFunctionRunning = false;
        }, 2000);
        
    });
}
const updatelocalStorage = () => { /* Função para salvar as informações no LocalStorage */
    let numberGenereteInfo = {
        startNumber: parseInt(inputStartNumber.val()),
        endNumber: parseInt(inputEndNumber.val()),
        generatedNumbers: generatedNumbers
    }

    localStorage.setItem('RNGenerator', JSON.stringify(numberGenereteInfo));
}
const genereteNewNumber = () => { /* Função para gerar novos números */
    btnGeneratorNumbers.prop('disabled', true); // Desativando o Botão de gerar mais

    // Verificando se os inputs não estão vazios
    if(inputStartNumber.val() == '' || inputEndNumber.val() == ''){
        //Cocolando classe de erro caso esteja vazio ou tirando caso naõ esteja
        inputStartNumber.val() == '' ? inputStartNumber.parent('.inputs-single').addClass('error') : inputStartNumber.parent('.inputs-single').removeClass('error'); // Input Start
        inputEndNumber.val() == '' ? inputEndNumber.parent('.inputs-single').addClass('error') : inputEndNumber.parent('.inputs-single').removeClass('error'); // Input End

        notificatioon('error', 'Informe os intervalos de números para serem gerados', '', false);

        btnGeneratorNumbers.prop('disabled', false); // Ativando o botão para gerar mais
        isFunctionRunning = false;
        isFunctionRunning = false;
    }else{
        // Removendo a classe pré definida
        inputStartNumber.parent('.inputs-single').removeClass('error');
        inputEndNumber.parent('.inputs-single').removeClass('error');

        let startNumber = parseInt(inputStartNumber.val());
        let endNumber = parseInt(inputEndNumber.val());

        if(startNumber == endNumber){ // Veriricando se os inputs são Iguais
            inputStartNumber.parent('.inputs-single').addClass('error');
            inputEndNumber.parent('.inputs-single').addClass('error');

            notificatioon('error', 'O valor inicial não pode ser igual ao valor final', '', false);

            btnGeneratorNumbers.prop('disabled', false); // Ativando o botão para gerar mais
            isFunctionRunning = false;
        }else if(startNumber > endNumber){ // Verificando se o primeiro input não é menor que o segundo
            inputStartNumber.parent('.inputs-single').addClass('error');
            inputEndNumber.parent('.inputs-single').addClass('error');

            notificatioon('error', 'O valor inicial não pode ser maior que o valor final', '', false);
            
            btnGeneratorNumbers.prop('disabled', false); // Ativando o botão para gerar mais
            isFunctionRunning = false;
        }else if(startNumber < 0){ // Verificando se o primeiro input não está abaixo de 0
            inputStartNumber.parent('.inputs-single').addClass('error');

            notificatioon('error', 'O valor inicial não pode ser menor que 0', '', false);

            btnGeneratorNumbers.prop('disabled', false); // Ativando o botão para gerar mais
            isFunctionRunning = false;
        }else if(endNumber <= 0){ // Veriricando se o segundo input não é igual ou menor que 0
            inputEndNumber.parent('.inputs-single').addClass('error');

            notificatioon('error', 'O valor final não pode ser menor ou igual que 0', '', false);

            btnGeneratorNumbers.prop('disabled', false); // Ativando o botão para gerar mais
            isFunctionRunning = false;
        }else{
            // Removendo a classe de erro dos inputs e adicionando classe disabled
            inputStartNumber.parent('.inputs-single').removeClass('error').addClass('disabled');
            inputStartNumber.prop('disabled', true);
            inputEndNumber.parent('.inputs-single').removeClass('error').addClass('disabled');
            inputEndNumber.prop('disabled', true);

            notificatioon('success', 'Gerando número...', '', false);

            if(generatedNumbers.length == (endNumber - startNumber)){ // Verificando se já foi gerado todos os números possiveis
                notificatioon('attention', 'Não há mais números para serem gerados', '', false);
                isFunctionRunning = false;
            }else{
                var numberGenerete = getRandom(endNumber); // Armazenando número gerado

                while(numberGenerete < startNumber) { // Veriricando se o número não é menor que o número inicial
                    numberGenerete = getRandom(endNumber); // Armazenando novo número gerado
                }

                if(generatedNumbers.length > 0){ // Verificando se já existem números gerados
                    while($.inArray(numberGenerete, generatedNumbers) !== -1){
                        numberGenerete = getRandom(endNumber);

                        while(numberGenerete < startNumber) { // Veriricando se o número não é menor que o número inicial
                            numberGenerete = getRandom(endNumber); // Armazenando novo número gerado
                        }
                    }
                    generatedNumbers.push(numberGenerete); // Adicionando novos Números gerados
                }else{
                    generatedNumbers.push(numberGenerete); // Adicionando novos Números gerados
                }

                btnRemoveNumbers.addClass('active'); // Adicionando o botão de Remover todos os números gerados

                // Removendo qualquer classe que esteja dentro do container
                containerNumber.addClass('remove'); 
                setTimeout(() => {
                    containerNumber.find('.no-result').remove();
                    containerNumber.removeClass('remove');
                    containerNumber.slideToggle(300, async function(){
                        // Adicionando container do número
                        newContainNumber(numberGenerete);
                    });
                }, 500);
                
                updatelocalStorage(); // Atualizando os números gerados
                
            }
        }

    }
}
const removeAllNumbers = () => { /* Função para deletar todos os números gerados */
    localStorage.setItem('RNGenerator', JSON.stringify('')); // Removendo todos as informações guardadas
    
    if(generatedNumbers.length > 0){
        for(let i = 0; i < generatedNumbers.length; i++){ // Rodado loop dos números gerados para adicionar ao container dos números
            setTimeout(async () => { // Tirando da tela um por um
                await containerNumber.find('.single-number:nth-child('+(generatedNumbers.length-(i))+')').addClass('preview');
            }, (i+1)*100);
    
            if(i+1 == generatedNumbers.length){ // Deletando todos os números
    
                setTimeout(async () => {
                    await containerNumber.find('.single-number').remove();
                }, generatedNumbers.length*100);
            }
        }
    
        containerNumber.slideUp(generatedNumbers.length*200, function(){ // Informando que não há mais números gerados    
            containerNumber.append(NoResult()); // Informando que não há números gerados
        
            containerNumber.slideDown(300, function(){
                setTimeout(()=>{
                    containerNumber.removeClass('remove');
    
                    // Limpando e liberando os inputs
                    inputStartNumber.val('');
                    inputEndNumber.val('');
                    inputStartNumber.parent('.inputs-single').removeClass('disabled');
                    inputStartNumber.prop('disabled', false);
                    inputEndNumber.parent('.inputs-single').removeClass('disabled');
                    inputEndNumber.prop('disabled', false);
                    btnGeneratorNumbers.prop('disabled', false);
                    isFunctionRunning = false;
                    generatedNumbers.length = 0;
                }, 500);
            });
        });
    }else{
        // Limpando e liberando os inputs
        inputStartNumber.val('');
        inputEndNumber.val('');
        inputStartNumber.parent('.inputs-single').removeClass('disabled');
        inputStartNumber.prop('disabled', false);
        inputEndNumber.parent('.inputs-single').removeClass('disabled');
        inputEndNumber.prop('disabled', false);
        btnGeneratorNumbers.prop('disabled', false);
        isFunctionRunning = false;
        generatedNumbers.length = 0;
    }
    btnRemoveNumbers.removeClass('active'); // Adicionando o botão de Remover todos os números gerados
}
const removeUniqNumber = (numberRemover, containerNumberRemove) => { /* Removendo um único número */
        var numberIndice = generatedNumbers.indexOf(parseInt(numberRemover));
    
        while(numberIndice >= 0){ // Rodando Loop para achar o número clicado e remove-lo
            generatedNumbers.splice(numberIndice, 1);
    
            numberIndice = generatedNumbers.indexOf(parseInt(numberRemover)); // Verificando se não está repetindo
        }
    
        updatelocalStorage(); // Atualizando o LocalStore
    
        // Removendo o Item da Tela
        containerNumberRemove.addClass('preview');
    
        containerNumber.slideUp(300, function(){
            containerNumberRemove.remove();
            containerNumber.addClass('remove');
        });
    
        containerNumber.slideDown(300, function(){
            if(generatedNumbers.length == 0){
                containerNumber.append(NoResult()); // Informando que não há números gerados
    
                setTimeout(() => {
                    containerNumber.removeClass('remove');
                }, 200);
            }else{
                containerNumber.removeClass('remove');
            }
            btnGeneratorNumbers.prop('disabled', false); // Ativando o Botão de gerar mais
            isFunctionRunning = false;
        });
}

// Eventos
btnGeneratorNumbers.click(function(){ // Btn para geração de novo número aleatório
    if(!isFunctionRunning) { // Verifica se a função não está em execução
        isFunctionRunning = true;
        genereteNewNumber(); // Aguarda a função terminar
    }else {
        notificatioon('attention', 'Tenha paciência...', 'Aguarde a última execução', false);
    }
    return false;
});

$(document).ready(function() {
    $(document).on('keyup', function(e) {
        if(e.keyCode == 13) {
            if(!isFunctionRunning) { // Verifica se a função não está em execução
                isFunctionRunning = true;
                genereteNewNumber(); // Aguarda a função terminar
            }else {
                notificatioon('attention', 'Tenha paciência...', 'Aguarde a última execução', false);
            }
        }
        if(e.keyCode == 27){
            if(!isFunctionRunning) { // Verifica se a função não está em execução
                isFunctionRunning = true;
                removeAllNumbers(); // Aguarda a função terminar
            }else{
                notificatioon('attention', 'Tenha paciência...', 'Aguarde a última execução', false);
            }
        }
        if(e.keyCode == 8){
            if(!isFunctionRunning) { // Verifica se a função não está em execução
                if(generatedNumbers.length > 0){
                    isFunctionRunning = true;
                    let lastNumber = containerNumber.find('.single-number:last-child [data-number]').attr('data-number')
                    let containerLastNumber = containerNumber.find('.single-number:last-child')
    
                    removeUniqNumber(lastNumber, containerLastNumber); // Aguarda a função terminar
                }else{
                    notificatioon('attention', 'Calma...', 'Não há mais números para serem excluídos', false);
                }
            }else{
                notificatioon('attention', 'Tenha paciência...', 'Aguarde a última execução', false);
            }
        }
    });
});


btnRemoveNumbers.click(async function(){ // Btn para remover todos os números gerados
    if(!isFunctionRunning){ // Verifica se a função não está em execução
        isFunctionRunning = true;
        removeAllNumbers();
    }else{
        notificatioon('attention', 'Tenha paciência...', 'Aguarde a última execução', false);
    }


    return false;
});

$(document).on('click', '[data-number]', async function(){ // Btn para remover um número por vez
    if(!isFunctionRunning){ // Verifica se a função não está em execução
        isFunctionRunning = true;
        removeUniqNumber($(this).attr('data-number'), $(this).parent('.single-number'));
    }else{
        notificatioon('attention', 'Tenha paciência...', 'Aguarde a última execução', false);
    }

    return false;
});