# Galerie de Design - Instructions d'utilisation

## Comment ajouter des images à la galerie

1. **Format des images** : Seules les images JPG sont acceptées
2. **Nommage** : Nommez vos images avec des chiffres séquentiels :
   - `1.jpg`
   - `2.jpg`
   - `3.jpg`
   - etc.

3. **Emplacement** : Placez vos images directement dans ce dossier (`img/designs/`)

## Fonctionnalités de la galerie

- **Chargement automatique** : Les images sont chargées automatiquement au chargement de la page
- **Responsive** : La galerie s'adapte à tous les écrans (mobile, tablette, desktop)
- **Effets visuels** : 
  - Animation d'apparition progressive
  - Effet de survol avec zoom
  - Overlay avec informations
- **Modal d'aperçu** : Cliquez sur l'icône d'agrandissement pour voir l'image en grand
- **Lazy loading** : Les images se chargent au fur et à mesure pour optimiser les performances

## Structure de la galerie

```
img/designs/
├── 1.jpg
├── 2.jpg
├── 3.jpg
├── ...
└── README.md (ce fichier)
```

## Limite d'images

- Maximum : 50 images
- Si vous avez plus de 50 images, le script s'arrêtera automatiquement

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que vos images sont bien au format JPG
2. Vérifiez que les noms suivent le format `1.jpg`, `2.jpg`, etc.
3. Vérifiez que les images sont dans le bon dossier (`img/designs/`)
4. Rechargez la page pour voir les changements
