import { generatePalette } from './modules/utils.js';
import convert from 'color-convert';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// Initialisation des notifications
const notyf = new Notyf();

// Fonction pour convertir HSL en HEX
function hslToHex(h, s, l) {
  const [r, g, b] = convert.hsl.rgb(h, s, l);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Fonction pour mettre à jour le dégradé du fond
function updateGradient(palette) {
  const gradient = palette
    .map(([h, s, l]) => hslToHex(h, s, l))
    .join(', ');
  document.body.style.background = `linear-gradient(-45deg, ${gradient})`;
  document.body.style.backgroundSize = '400% 400%';
}

// Fonction pour mettre à jour la couleur d'ombre
function updateShadowColor([h, s, l]) {
  const shadowColor = `${h}deg ${s}% ${l}%`;
  document.documentElement.style.setProperty('--shadow-color', shadowColor);
}

// Fonction pour créer un élément DOM représentant une couleur
function createColorElement([h, s, l]) {
  const hex = hslToHex(h, s, l);
  const colorDiv = document.createElement('div');
  colorDiv.classList.add('color');
  colorDiv.dataset.color = hex;
  colorDiv.style.backgroundColor = hex;

  const text = document.createElement('p');
  text.textContent = hex;
  text.style.color = l < 60 ? '#ffffff' : '#000000';
  colorDiv.appendChild(text);

  return colorDiv;
}

// Fonction principale pour afficher les couleurs
function displayColors(palette) {
  const main = document.querySelector('main');
  const header = document.querySelector('header');

  // Réinitialisation du contenu et ajout de la classe "minimized"
  main.innerHTML = '';
  header.classList.add('minimized');

  // Mise à jour du dégradé et de la couleur d'ombre
  updateGradient(palette);
  updateShadowColor(palette[0]);

  // Ajout des couleurs générées au DOM
  palette.forEach((color) => {
    const colorElement = createColorElement(color);
    main.appendChild(colorElement);
  });
}

// Fonction pour copier une couleur dans le presse-papier
function handleColorClick(event) {
  const target = event.target.closest('.color');
  if (!target) return;

  const hex = target.dataset.color;

  navigator.clipboard
    .writeText(hex)
    .then(() => {
      notyf.success(`Copied ${hex} to clipboard!`);
    })
    .catch(() => {
      notyf.error('Failed to copy to clipboard.');
    });
}

// Gestionnaire de soumission du formulaire
function handleSubmit(event) {
  event.preventDefault();

  const input = event.target.querySelector('input').value.trim();

  // Validation de l'entrée HEX
  if (!/^#[0-9A-F]{6}$/i.test(input)) {
    notyf.error(`${input} is not a valid Hexadecimal color.`);
    return;
  }

  // Génération de la palette et affichage
  const palette = generatePalette(input);
  displayColors(palette);
}

// Ajout d'un event listener au formulaire
document.querySelector('form').addEventListener('submit', handleSubmit);

// Ajout d'un event listener au <main> pour gérer les clics sur les couleurs
document.querySelector('main').addEventListener('click', handleColorClick);
