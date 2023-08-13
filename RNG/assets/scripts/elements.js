const containNumberGenerete = (number) => {
    let element = `
        <div class="single-number transition user-select-none preview">
            <button class="remover-number transition" data-number="${number}" title="Remover Número ${number}"><i class="bi bi-x-lg"></i></button>
            <p>${number}</p>
        </div>
    `;

    return element;
}
const NoResult = () => {
    let element = `
        <div class="no-result transition user-select-none">
            <p>Não há números gerados no momento</p>
        </div>
    `;

    return element;
}