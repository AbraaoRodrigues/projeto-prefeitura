document.addEventListener("DOMContentLoaded", function () {
    // Bloqueia o campo "Valor Estimado" para edição manual
    document.getElementById("valor_estimado").setAttribute("readonly", true);

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

    // Aplica máscara de dinheiro na primeira linha automaticamente
    document.querySelector(".valor-unitario").addEventListener("input", function () {
        aplicarMascaraDinheiro(this);
        calcularTotal(this);
    });
});

// Função para aplicar máscara de dinheiro
function aplicarMascaraDinheiro(input) {
    let value = input.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    value = (parseFloat(value) / 100).toFixed(2); // Converte para decimal
    input.value = "R$ " + value.replace(".", ","); // Formata e adiciona o símbolo de real
}

// Função para calcular o total de cada item e atualizar o valor estimado
function calcularTotal(elemento) {
    const linha = elemento.closest("tr");
    const quantidade = parseFloat(linha.querySelector(".quantidade").value) || 0;
    const valorUnitario = parseFloat(linha.querySelector(".valor-unitario").value.replace("R$", "").replace(",", ".")) || 0;

    // Calcula o total e atualiza o campo correspondente
    const total = quantidade * valorUnitario;
    linha.querySelector(".total").value = "R$ " + total.toFixed(2).replace(".", ",");

    // Atualiza o valor estimado
    atualizarValorEstimado();
}

// Função para atualizar o valor estimado (soma dos totais da tabela)
function atualizarValorEstimado() {
    let totalEstimado = 0;
    document.querySelectorAll(".total").forEach(input => {
        let valor = parseFloat(input.value.replace("R$", "").replace(",", ".")) || 0;
        totalEstimado += valor;
    });
    document.getElementById("valor_estimado").value = "R$ " + totalEstimado.toFixed(2).replace(".", ",");
}

// Função para adicionar novas linhas na tabela
function adicionarLinhas() {
    const quantidade = parseInt(document.getElementById("quantidade-linhas").value) || 1;
    document.getElementById("quantidade-linhas").value = ""; // Limpa o campo

    const tabela = document.getElementById("tabela-itens").getElementsByTagName("tbody")[0];

    for (let i = 0; i < quantidade; i++) {
        const novaLinha = tabela.insertRow();

        // Número sequencial
        const numeroCell = novaLinha.insertCell(0);
        numeroCell.textContent = tabela.rows.length;

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
        inputQuantidade.addEventListener("input", function () {
            calcularTotal(this);
            atualizarDespacho();
        });
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
        inputValorUnitario.addEventListener("input", function () {
            aplicarMascaraDinheiro(this);
            calcularTotal(this);
            atualizarDespacho();
        });
        valorUnitarioCell.appendChild(inputValorUnitario);

        // Total
        const totalCell = novaLinha.insertCell(5);
        const inputTotal = document.createElement("input");
        inputTotal.type = "text";
        inputTotal.className = "total";
        inputTotal.setAttribute("readonly", true);
        totalCell.appendChild(inputTotal);

        // Checkbox para exclusão
        const checkboxCell = novaLinha.insertCell(6);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "linha-checkbox";
        checkboxCell.appendChild(checkbox);
    }
}

// Função para excluir linhas selecionadas
function excluirLinhas() {
    const tabela = document.getElementById("tabela-itens").getElementsByTagName("tbody")[0];
    const checkboxes = tabela.querySelectorAll(".linha-checkbox:checked");

    checkboxes.forEach(checkbox => {
        const linha = checkbox.closest("tr");
        linha.remove();
    });

    // Atualiza os números das linhas após exclusão
    Array.from(tabela.rows).forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });

    // Atualiza o valor estimado
    atualizarValorEstimado();
}

// Atualiza o secretário automaticamente ao mudar a secretaria
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

    function atualizarSecretario() {
        const setorDropdown = document.getElementById("setor");
        const secretaria = setorDropdown.options[setorDropdown.selectedIndex]?.text;
        document.getElementById("secretario").value = secretarios[secretaria] || "";
    }

    atualizarSecretario();
    document.getElementById("setor").addEventListener("change", atualizarSecretario);
});

function atualizarDespacho() {
    const tipoSolicitacao = document.getElementById("tipo_solicitacao").options[document.getElementById("tipo_solicitacao").selectedIndex].text;
    const modalidade = document.getElementById("modalidade").options[document.getElementById("modalidade").selectedIndex].text;
    const numeroContrato = document.getElementById("numero_contrato").value;
    const numeroProcesso = document.getElementById("numero_processo").value;
    const numeroPregao = document.getElementById("numero_pregao").value;
    const nomeEmpresa = document.getElementById("empresa").value;
    const cnpj = document.getElementById("cnpj").value;

    // Contar linhas preenchidas
    const tabela = document.getElementById("tabela-itens");
    const rows = Array.from(tabela.querySelectorAll("tbody tr")).filter(row => {
        const descricao = row.querySelector(".descricao").value.trim();
        return descricao !== ""; // Apenas conta linhas com descrição preenchida
    });

    const linhasPreenchidas = rows.length;

    let despacho = "";

    if (modalidade === "Inexigibilidade") {
        despacho = `Autorizo a contratação do serviço abaixo para o fornecedor: ${nomeEmpresa} - CNPJ: ${cnpj}. Com dispensa de licitação de acordo com Art. 75, inciso II da Lei 14.133/2021.`;
    } else if (linhasPreenchidas > 0) {
        if (tipoSolicitacao === "Serviço") {
            despacho = `Autorizo a contratação ${linhasPreenchidas === 1 ? "do serviço relacionado" : "dos serviços relacionados"} na tabela acima para a empresa: ${nomeEmpresa}, CNPJ/MF Nº ${cnpj}, conforme Processo Licitatório de ${modalidade} Nº ${numeroProcesso}, Nº do Pregão ${numeroPregao} e Contrato Nº ${numeroContrato}.`;
        } else {
            despacho = `Autorizo a aquisição ${linhasPreenchidas === 1 ? "do item relacionado" : "dos itens relacionados"} na tabela acima para a empresa: ${nomeEmpresa}, CNPJ/MF Nº ${cnpj}, conforme Processo Licitatório de ${modalidade} Nº ${numeroProcesso}, Nº do Pregão ${numeroPregao} e Contrato Nº ${numeroContrato}.`;
        }
    } else {
        despacho = ""; // Se não houver nenhuma linha preenchida, limpa o despacho
    }

    document.getElementById("despacho").value = despacho;
}

// Atualizar o despacho ao alterar os campos relevantes
document.getElementById("tipo_solicitacao").addEventListener("change", atualizarDespacho);
document.getElementById("modalidade").addEventListener("change", atualizarDespacho);
document.getElementById("tabela-itens").addEventListener("input", atualizarDespacho);
document.getElementById("empresa").addEventListener("input", atualizarDespacho);
document.getElementById("cnpj").addEventListener("input", atualizarDespacho);
document.getElementById("numero_processo").addEventListener("input", atualizarDespacho);
document.getElementById("numero_pregao").addEventListener("input", atualizarDespacho);
document.getElementById("numero_contrato").addEventListener("input", atualizarDespacho);

// Garante que o despacho seja atualizado ao carregar a página
atualizarDespacho();

