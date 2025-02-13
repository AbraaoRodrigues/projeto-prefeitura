document.addEventListener("DOMContentLoaded", function () {
    // Máscara para o campo Valor Estimado
    document.getElementById("valor_estimado").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length <= 2) {
            e.target.value = "R$ " + value;
        } else {
            e.target.value = "R$ " + value.replace(/(\d)(\d{2})$/, "$1,$2");
        }
    });

    // Máscara para o campo CNPJ
    document.getElementById("cnpj").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length <= 14) {
            e.target.value = value
                .replace(/^(\d{2})(\d)/, "$1.$2")
                .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                .replace(/\.(\d{3})(\d)/, ".$1/$2")
                .replace(/(\d{4})(\d)/, "$1-$2");
        }
    });
});
function aplicarMascaraDinheiro(input) {
    let value = input.value.replace(/\D/g, "");
    value = (value / 100).toFixed(2) + ""; // Converte para formato decimal
    value = value.replace(".", ","); // Substitui ponto por vírgula
    input.value = "R$ " + value; // Adiciona o símbolo de real
}


    // Função para adicionar uma nova linha na tabela
    function adicionarLinhas() {
    const quantidade = parseInt(document.getElementById("quantidade-linhas").value) || 1; // Valor do campo ou 1
	document.getElementById("quantidade-linhas").value = ""; // Limpa o campo

    const tabela = document.getElementById("tabela-itens").getElementsByTagName("tbody")[0];

    for (let i = 0; i < quantidade; i++) {
        const novaLinha = tabela.insertRow();

        // Número sequencial
        const numeroCell = novaLinha.insertCell(0);
        numeroCell.textContent = tabela.rows.length; // Número automático

        // Descrição
        const descricaoCell = novaLinha.insertCell(1);
        const inputDescricao = document.createElement("input");
        inputDescricao.type = "text";
        inputDescricao.className = "descricao";
        descricaoCell.appendChild(inputDescricao);

        // Quantidade
        const quantidadeCell = novaLinha.insertCell(2);
        const inputQuantidade = document.createElement("input");
        inputQuantidade.type = "number";
        inputQuantidade.className = "quantidade";
        inputQuantidade.setAttribute("oninput", "calcularTotal(this)");
        quantidadeCell.appendChild(inputQuantidade);

        // Unidade
        const unidadeCell = novaLinha.insertCell(3);
        const inputUnidade = document.createElement("input");
        inputUnidade.type = "text";
        inputUnidade.className = "unidade";
        unidadeCell.appendChild(inputUnidade);

        // Valor Unitário
        const valorUnitarioCell = novaLinha.insertCell(4);
        const inputValorUnitario = document.createElement("input");
        inputValorUnitario.type = "text";
        inputValorUnitario.className = "valor-unitario";
		inputValorUnitario.setAttribute("oninput", "aplicarMascaraDinheiro(this); calcularTotal(this)");
        valorUnitarioCell.appendChild(inputValorUnitario);

        // Total
        const totalCell = novaLinha.insertCell(5);
        const inputTotal = document.createElement("input");
        inputTotal.type = "text";
        inputTotal.className = "total";
        inputTotal.setAttribute("oninput", "aplicarMascaraDinheiro(this)"); // Para exibição apenas
        totalCell.appendChild(inputTotal);

        // Checkbox para excluir linha
        const checkboxCell = novaLinha.insertCell(6);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "linha-checkbox";
        checkboxCell.appendChild(checkbox);
    }
}

function excluirLinhas() {
    const tabela = document.getElementById("tabela-itens").getElementsByTagName("tbody")[0];
    const checkboxes = tabela.querySelectorAll(".linha-checkbox:checked"); // Linhas selecionadas

    checkboxes.forEach((checkbox) => {
        const linha = checkbox.closest("tr"); // Linha associada ao checkbox
        linha.remove();
    });

    // Atualiza os números das linhas após a exclusão
    Array.from(tabela.rows).forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}


    document.addEventListener("DOMContentLoaded", function () {
    const secretarios = {
        "Secretaria de Administração e Finanças": "Thiago Portapila Gomes",
        "Secretaria de Assistência Social e Cidadania": "Paula Rachel Ghirotti Garcia",
        "Secretaria de Agricultura": "Cristiano José Nakaya",
        "Secretaria de Educação e Cultura": "Gina Sanchez",
        "Secretaria de Esporte e Lazer": "Juliana Soares Sobral",
        "Secretaria de Planejamento Urbano e Meio Ambiente": "José Luiz da Silva Maia",
        "Secretaria de Obras e Infraestrutura": "",
        "Secretaria de Saúde": "Altair Francisco Silva",
        "Secretaria de Serviços Urbanos e Mobilidade": "Luciano Coutinho",
    };

    // Atualiza o campo Secretário
    function atualizarSecretario() {
        const setorDropdown = document.getElementById("setor");
        const secretaria = setorDropdown.options[setorDropdown.selectedIndex]?.text;
        const secretario = secretarios[secretaria] || "";
        document.getElementById("secretario").value = secretario;
    }

    // Chama a função ao carregar a página
    atualizarSecretario();

    // Atualiza o campo ao mudar a seleção
    document.getElementById("setor").addEventListener("change", atualizarSecretario);
});


    // Função para calcular o total de cada item
    function calcularTotal(elemento) {
    const linha = elemento.closest("tr");
    const quantidade = parseFloat(linha.querySelector(".quantidade").value) || 0;
    const valorUnitario = parseFloat(linha.querySelector(".valor-unitario").value) || 0;

    // Calcula o total
    const total = quantidade * valorUnitario;

    // Atualiza o campo "Total"
    linha.querySelector(".total").value = total > 0 ? total.toFixed(2) : "";
}

document.addEventListener("DOMContentLoaded", function () {
    function atualizarDespacho() {
    const tipoSolicitacao = document.getElementById("tipo_solicitacao").options[document.getElementById("tipo_solicitacao").selectedIndex].text;
    const modalidade = document.getElementById("modalidade").options[document.getElementById("modalidade").selectedIndex].text;
    const numeroContrato = document.getElementById("numero_contrato").value;
    const numeroProcesso = document.getElementById("numero_processo").value;
    const nomeEmpresa = document.getElementById("empresa").value;
    const cnpj = document.getElementById("cnpj").value;

    // Contar linhas preenchidas
    const tabela = document.getElementById("tabela-itens");
    const rows = Array.from(tabela.querySelectorAll("tbody tr")).filter((row) => {
        const descricao = row.querySelector(".descricao").value.trim();
        return descricao !== "";
    });
    const linhasPreenchidas = rows.length;

    // Determinar o despacho
    let despacho = "";
    if (tipoSolicitacao === "Serviço") {
        if (linhasPreenchidas === 1) {
            despacho = `Autorizo a contratação do serviço relacionado na tabela acima para a empresa: ${nomeEmpresa}, CNPJ/MF Nº ${cnpj}, conforme Processo Licitatório de ${modalidade} Nº ${numeroProcesso}, Contrato Nº ${numeroContrato}.`;
        } else if (linhasPreenchidas > 1) {
            despacho = `Autorizo a contratação dos serviços relacionados na tabela acima para a empresa: ${nomeEmpresa}, CNPJ/MF Nº ${cnpj}, conforme Processo Licitatório de ${modalidade} Nº ${numeroProcesso}, Contrato Nº ${numeroContrato}.`;
        }
    } else if (tipoSolicitacao === "Material") {
        if (linhasPreenchidas === 1) {
            despacho = `Autorizo a aquisição do item relacionado na tabela acima para a empresa: ${nomeEmpresa}, CNPJ/MF Nº ${cnpj}, conforme Processo Licitatório de ${modalidade} Nº ${numeroProcesso}, Contrato Nº ${numeroContrato}.`;
        } else if (linhasPreenchidas > 1) {
            despacho = `Autorizo a aquisição dos itens relacionados na tabela acima para a empresa: ${nomeEmpresa}, CNPJ/MF Nº ${cnpj}, conforme Processo Licitatório de ${modalidade} Nº ${numeroProcesso}, Contrato Nº ${numeroContrato}.`;
        }
    }

    // Atualizar o campo de despacho
    document.getElementById("despacho").value = despacho;
}

// Atualizar o despacho ao alterar os campos relevantes
document.getElementById("tipo_solicitacao").addEventListener("change", atualizarDespacho);
document.getElementById("modalidade").addEventListener("change", atualizarDespacho);
document.getElementById("tabela-itens").addEventListener("input", atualizarDespacho);
document.getElementById("empresa").addEventListener("input", atualizarDespacho);
document.getElementById("cnpj").addEventListener("input", atualizarDespacho);

// Gerar o despacho inicial ao carregar a página
atualizarDespacho();

});
