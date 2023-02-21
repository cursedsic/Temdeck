const temtemName = document.querySelector('.temtem__name');
const temtemNumber = document.querySelector('.temtem__number');
const temtemImage = document.querySelector('.temtem__image');
const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const logo = document.querySelector('.luma__logo');

const apiEndpoint = 'https://temtem-api.mael.tech/api';

// Função para buscar informações do Temtem por nome ou número
const fetchTemtem = async (search) => {
  let temtem = {};

  // Buscar pelo número do Temtem
  if (!isNaN(search)) {
    try {
      const response = await axios.get(`${apiEndpoint}/temtems/${search}`);
      temtem = response.data;
    } catch (error) {
      console.error(error);
    }
  }
  // Buscar pelo nome do Temtem
  else {
    try {
      const response = await axios.get(`${apiEndpoint}/temtems?names=${search}`);
      temtem = response.data[0];
    } catch (error) {
      console.error(error);
    }
  }

  return temtem;
};

let searchTemtemNumber = 1;
let searchTemtemName = '';

// Préload
window.addEventListener('DOMContentLoaded', () => {
  renderTemtem(1); // carrega o primeiro Temtem
});

// Função para renderizar as informações do Temtem na página
const renderTemtem = async (search) => {
  temtemName.innerHTML = 'Loading...';
  temtemNumber.innerHTML = '';

  const temtem = await fetchTemtem(search);

  if (temtem.name) {
    temtemImage.style.display = 'block';
    temtemName.innerHTML = temtem.name;
    temtemNumber.innerHTML = `#${String(temtem.number).padStart(3, '0')} - `;
    temtemImage.src = temtem.wikiRenderAnimatedUrl;
    input.value = '';
    searchTemtemNumber = temtem.number;
    searchTemtemName = temtem.name;
  } else {
    temtemImage.style.display = 'none';
    temtemName.innerHTML = 'Not found :c';
    temtemNumber.innerHTML = '';
  }

  // Define o objeto temtem na variável global para uso posterior
  window.temtem = temtem;
};

// Adicionar um listener para a submissão do formulário de busca
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputValue = input.value.charAt(0).toUpperCase() + input.value.substring(1);
  if (!isNaN(inputValue)) {
    renderTemtem(inputValue);
    searchTemtemNumber = parseInt(inputValue);
  } else {
    searchTemtemName = inputValue;
    renderTemtem(inputValue);
  }
});

// Adicionar listeners para os botões de navegação
buttonPrev.addEventListener('click', () => {
  if (searchTemtemNumber > 1) {
    searchTemtemNumber -= 1;
    renderTemtem(searchTemtemNumber);
  }
});

buttonNext.addEventListener('click', () => {
  searchTemtemNumber += 1;
  renderTemtem(searchTemtemNumber);
});

logo.addEventListener('click', () => {
  // Alterna o atributo src da temtemImage entre wikiRenderAnimatedUrl e wikiRenderAnimatedLumaUrl
  if (temtemImage.src === temtem.wikiRenderAnimatedUrl) {
    temtemImage.src = temtem.wikiRenderAnimatedLumaUrl;
  } else {
    temtemImage.src = temtem.wikiRenderAnimatedUrl;
  }
});

