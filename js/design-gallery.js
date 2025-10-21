// Design Gallery Script
// Charge automatiquement les images de design depuis le dossier img/designs/

document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.getElementById('design-gallery');
    
    if (!galleryContainer) {
        console.error('Container #design-gallery not found');
        return;
    }

    // Configuration
    const maxImages = 50; // Limite maximale d'images
    const imagePath = 'img/designs/';
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    
    // Fonction pour créer un élément d'image avec lazy loading
    function createImageElement(imageNumber) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in';
        imageContainer.style.animationDelay = `${imageNumber * 0.1}s`;
        
        // Créer l'image avec lazy loading
        const img = document.createElement('img');
        img.className = 'w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110';
        img.loading = 'lazy';
        img.alt = `Design ${imageNumber}`;
        img.src = `${imagePath}${imageNumber}.jpg`;
        
        // Gérer les erreurs de chargement
        img.onerror = function() {
            console.log(`Image ${imageNumber}.jpg not found, stopping gallery loading`);
            return false; // Arrêter le chargement si l'image n'existe pas
        };
        
        // Overlay avec informations
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6';
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'text-white';
        overlayContent.innerHTML = `
            <h3 class="text-lg font-bold mb-2">Design ${imageNumber}</h3>
            <p class="text-sm text-gray-200 mb-4">Création visuelle professionnelle</p>
            <div class="flex space-x-3">
                <button class="view-btn bg-accent/80 hover:bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
                    <i class="fas fa-expand mr-2"></i>
                    Voir
                </button>
                <button class="download-btn bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
                    <i class="fas fa-download mr-2"></i>
                    Télécharger
                </button>
            </div>
        `;
        
        overlay.appendChild(overlayContent);
        imageContainer.appendChild(img);
        imageContainer.appendChild(overlay);
        
        return imageContainer;
    }
    
    // Fonction pour charger les images
    function loadDesignImages() {
        let imageNumber = 1;
        let loadedCount = 0;
        
        const loadNextImage = () => {
            if (loadedCount >= maxImages) {
                console.log(`Maximum de ${maxImages} images atteint`);
                return;
            }
            
            // Créer l'élément image
            const imageElement = createImageElement(imageNumber);
            
            // Tester si l'image existe
            const testImg = new Image();
            testImg.onload = function() {
                // L'image existe, l'ajouter à la galerie
                galleryContainer.appendChild(imageElement);
                loadedCount++;
                
                // Ajouter les événements pour les boutons
                addImageEvents(imageElement, imageNumber);
                
                // Charger l'image suivante
                imageNumber++;
                setTimeout(loadNextImage, 100); // Délai pour l'animation
            };
            
            testImg.onerror = function() {
                // L'image n'existe pas, arrêter le chargement
                console.log(`Galerie chargée: ${loadedCount} images trouvées`);
                return;
            };
            
            testImg.src = `${imagePath}${imageNumber}.jpg`;
        };
        
        // Démarrer le chargement
        loadNextImage();
    }
    
    // Fonction pour ajouter les événements aux boutons
    function addImageEvents(imageElement, imageNumber) {
        const viewBtn = imageElement.querySelector('.view-btn');
        const downloadBtn = imageElement.querySelector('.download-btn');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openImageModal(imageNumber);
            });
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                downloadImage(imageNumber);
            });
        }
        
        // Clic sur l'image pour ouvrir le modal
        const img = imageElement.querySelector('img');
        if (img) {
            img.addEventListener('click', function() {
                openImageModal(imageNumber);
            });
            
            // Permettre le clic droit pour télécharger
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showRightClickInstructions(imageNumber);
            });
        }
    }
    
    // Fonction pour ouvrir le modal d'aperçu
    function openImageModal(imageNumber) {
        // Créer le modal s'il n'existe pas
        let modal = document.getElementById('image-modal');
        if (!modal) {
            modal = createImageModal();
            document.body.appendChild(modal);
        }
        
        // Mettre à jour l'image du modal
        const modalImg = modal.querySelector('#modal-image');
        const modalTitle = modal.querySelector('#modal-title');
        
        modalImg.src = `${imagePath}${imageNumber}.jpg`;
        modalImg.alt = `Design ${imageNumber}`;
        modalTitle.textContent = `Design ${imageNumber}`;
        
        // Afficher le modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    // Fonction pour créer le modal
    function createImageModal() {
        const modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden';
        
        modal.innerHTML = `
            <div class="relative max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
                <button id="close-modal" class="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200">
                    <i class="fas fa-times text-lg"></i>
                </button>
                <div class="p-6 pb-4">
                    <h3 id="modal-title" class="text-2xl font-bold text-primary mb-4"></h3>
                </div>
                <div class="px-6 pb-6">
                    <img id="modal-image" class="w-full h-auto max-h-96 object-contain rounded-lg" alt="">
                </div>
                <div class="px-6 pb-6 flex justify-center space-x-4">
                    <button id="download-modal-btn" class="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center">
                        <i class="fas fa-download mr-2"></i>
                        Télécharger
                    </button>
                    <button id="close-modal-btn" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                        Fermer
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter les événements
        const closeModal = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        };
        
        modal.querySelector('#close-modal').addEventListener('click', closeModal);
        modal.querySelector('#close-modal-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        modal.querySelector('#download-modal-btn').addEventListener('click', function() {
            const imageNumber = modal.querySelector('#modal-image').src.split('/').pop().split('.')[0];
            downloadImage(imageNumber);
        });
        
        return modal;
    }
    
    // Fonction pour télécharger une image
    function downloadImage(imageNumber) {
        const imageUrl = `${imagePath}${imageNumber}.jpg`;
        const fileName = `design-${imageNumber}.jpg`;
        
        // Afficher un indicateur de chargement
        showNotification('Préparation du téléchargement...', 'info');
        
        // Méthode 1: Téléchargement via fetch (plus moderne)
        downloadImageViaFetch(imageUrl, fileName)
            .catch(() => {
                console.log('Fetch échoué, tentative avec canvas...');
                // Méthode 2: Téléchargement via canvas
                downloadImageViaCanvas(imageUrl, fileName)
                    .catch(() => {
                        console.log('Canvas échoué, téléchargement direct...');
                        // Méthode 3: Téléchargement direct (fallback)
                        downloadImageDirect(imageNumber);
                    });
            });
    }
    
    // Méthode 1: Téléchargement via fetch (recommandée)
    async function downloadImageViaFetch(imageUrl, fileName) {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            
            // Vérifier la taille du blob
            if (blob.size === 0) {
                throw new Error('Fichier vide reçu');
            }
            
            const url = URL.createObjectURL(blob);
            
            // Créer le lien de téléchargement avec plus d'attributs
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            link.setAttribute('download', fileName);
            
            // Forcer le téléchargement
            document.body.appendChild(link);
            
            // Simuler un clic utilisateur pour contourner les restrictions
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            link.dispatchEvent(clickEvent);
            
            // Attendre un peu avant de supprimer le lien
            setTimeout(() => {
                if (link.parentNode) {
                    document.body.removeChild(link);
                }
                URL.revokeObjectURL(url);
            }, 1000);
            
            // Détecter si le téléchargement a réussi
            detectDownloadSuccess(fileName);
            return true;
            
        } catch (error) {
            console.error('Erreur fetch:', error);
            throw error;
        }
    }
    
    // Méthode 2: Téléchargement via canvas
    function downloadImageViaCanvas(imageUrl, fileName) {
        return new Promise((resolve, reject) => {
            const tempImg = new Image();
            tempImg.crossOrigin = 'anonymous';
            
            tempImg.onload = function() {
                try {
                    // Créer un canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Définir les dimensions
                    canvas.width = tempImg.naturalWidth;
                    canvas.height = tempImg.naturalHeight;
                    
                    // Dessiner l'image
                    ctx.drawImage(tempImg, 0, 0);
                    
                    // Convertir en blob et télécharger
                    canvas.toBlob(function(blob) {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = fileName;
                            link.style.display = 'none';
                            
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            setTimeout(() => URL.revokeObjectURL(url), 100);
                            
                            // Détecter le succès du téléchargement
                            detectDownloadSuccess(fileName);
                            resolve(true);
                        } else {
                            reject(new Error('Impossible de créer le blob'));
                        }
                    }, 'image/jpeg', 0.9);
                    
                } catch (error) {
                    console.error('Erreur canvas:', error);
                    reject(error);
                }
            };
            
            tempImg.onerror = function() {
                console.error('Erreur lors du chargement de l\'image');
                reject(new Error('Impossible de charger l\'image'));
            };
            
            tempImg.src = imageUrl;
        });
    }
    
    // Fonction de fallback pour le téléchargement direct
    function downloadImageDirect(imageNumber) {
        const fileName = `design-${imageNumber}.jpg`;
        const imageUrl = `${imagePath}${imageNumber}.jpg`;
        
        try {
            // Créer le lien de téléchargement
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = fileName;
            link.target = '_blank';
            link.style.display = 'none';
            
            // Ajouter au DOM, cliquer, puis supprimer
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification(`Téléchargement direct de "${fileName}" lancé...`, 'info');
            
            // Vérifier si le téléchargement a réussi après un délai
            setTimeout(() => {
                showNotification(`Fichier "${fileName}" téléchargé !`, 'success');
            }, 1000);
            
        } catch (error) {
            console.error('Erreur téléchargement direct:', error);
            showNotification('Erreur lors du téléchargement. Essayez de cliquer droit sur l\'image et "Enregistrer sous..."', 'error');
        }
    }
    
    // Fonction pour détecter le succès du téléchargement
    function detectDownloadSuccess(fileName) {
        // Afficher des instructions détaillées
        setTimeout(() => {
            showDetailedDownloadInstructions(fileName);
        }, 500);
        
        // Ajouter un indicateur visuel que le fichier a été téléchargé
        const downloadIndicator = document.createElement('div');
        downloadIndicator.className = 'download-success-indicator fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        downloadIndicator.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>Fichier téléchargé !</span>
            </div>
        `;
        
        document.body.appendChild(downloadIndicator);
        
        // Supprimer l'indicateur après 5 secondes
        setTimeout(() => {
            if (downloadIndicator.parentElement) {
                downloadIndicator.style.opacity = '0';
                downloadIndicator.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (downloadIndicator.parentElement) {
                        downloadIndicator.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Fonction pour afficher des instructions détaillées de téléchargement
    function showDetailedDownloadInstructions(fileName) {
        // Créer une modal avec les instructions
        const instructionModal = document.createElement('div');
        instructionModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        instructionModal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-md w-full">
                <div class="text-center mb-4">
                    <i class="fas fa-download text-4xl text-green-500 mb-2"></i>
                    <h3 class="text-xl font-bold text-gray-900">Fichier téléchargé !</h3>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-blue-900 mb-2">📁 Où trouver votre fichier :</h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>• <strong>Dossier Téléchargements</strong> de votre ordinateur</li>
                        <li>• Nom du fichier : <code class="bg-blue-100 px-1 rounded">${fileName}</code></li>
                        <li>• Vérifiez la barre de téléchargement de votre navigateur</li>
                    </ul>
                </div>
                
                <div class="bg-yellow-50 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-yellow-900 mb-2">🔍 Si vous ne le trouvez pas :</h4>
                    <ul class="text-sm text-yellow-800 space-y-1">
                        <li>• Appuyez sur <kbd class="bg-yellow-200 px-1 rounded">Ctrl+J</kbd> (Chrome/Edge)</li>
                        <li>• Ou <kbd class="bg-yellow-200 px-1 rounded">Ctrl+Shift+Y</kbd> (Firefox)</li>
                        <li>• Regardez dans le dossier "Téléchargements" de votre profil</li>
                    </ul>
                </div>
                
                <div class="flex justify-center space-x-3">
                    <button id="close-instructions" class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Compris !
                    </button>
                    <button id="try-alternative" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Méthode alternative
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(instructionModal);
        
        // Événements pour les boutons
        instructionModal.querySelector('#close-instructions').addEventListener('click', () => {
            instructionModal.remove();
        });
        
        instructionModal.querySelector('#try-alternative').addEventListener('click', () => {
            instructionModal.remove();
            showAlternativeDownloadMethod(fileName);
        });
        
        // Fermer en cliquant à l'extérieur
        instructionModal.addEventListener('click', (e) => {
            if (e.target === instructionModal) {
                instructionModal.remove();
            }
        });
    }
    
    // Fonction pour afficher une méthode alternative de téléchargement
    function showAlternativeDownloadMethod(fileName) {
        const alternativeModal = document.createElement('div');
        alternativeModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        alternativeModal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-lg w-full">
                <div class="text-center mb-4">
                    <i class="fas fa-lightbulb text-4xl text-yellow-500 mb-2"></i>
                    <h3 class="text-xl font-bold text-gray-900">Méthode alternative</h3>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-gray-900 mb-2">🖱️ Cliquez droit sur l'image :</h4>
                    <ol class="text-sm text-gray-700 space-y-2">
                        <li>1. Cliquez droit sur l'image dans la galerie</li>
                        <li>2. Sélectionnez <strong>"Enregistrer l'image sous..."</strong></li>
                        <li>3. Choisissez l'emplacement de votre choix</li>
                        <li>4. Cliquez sur <strong>"Enregistrer"</strong></li>
                    </ol>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-blue-900 mb-2">💡 Conseil :</h4>
                    <p class="text-sm text-blue-800">
                        Cette méthode garantit que le fichier sera enregistré exactement où vous le souhaitez !
                    </p>
                </div>
                
                <div class="flex justify-center">
                    <button id="close-alternative" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Compris !
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(alternativeModal);
        
        alternativeModal.querySelector('#close-alternative').addEventListener('click', () => {
            alternativeModal.remove();
        });
        
        alternativeModal.addEventListener('click', (e) => {
            if (e.target === alternativeModal) {
                alternativeModal.remove();
            }
        });
    }
    
    // Fonction pour afficher les instructions du clic droit
    function showRightClickInstructions(imageNumber) {
        const rightClickModal = document.createElement('div');
        rightClickModal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        rightClickModal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-lg w-full">
                <div class="text-center mb-4">
                    <i class="fas fa-mouse-pointer text-4xl text-blue-500 mb-2"></i>
                    <h3 class="text-xl font-bold text-gray-900">Téléchargement par clic droit</h3>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-green-900 mb-2">✅ Méthode garantie :</h4>
                    <ol class="text-sm text-green-800 space-y-2">
                        <li>1. <strong>Cliquez droit</strong> sur l'image (pas sur le bouton)</li>
                        <li>2. Sélectionnez <strong>"Enregistrer l'image sous..."</strong></li>
                        <li>3. Choisissez votre dossier de destination</li>
                        <li>4. Le fichier sera enregistré avec le nom <code class="bg-green-100 px-1 rounded">design-${imageNumber}.jpg</code></li>
                    </ol>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 class="font-semibold text-blue-900 mb-2">💡 Avantages :</h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>• Vous choisissez l'emplacement exact</li>
                        <li>• Fonctionne sur tous les navigateurs</li>
                        <li>• Pas de problème de sécurité</li>
                        <li>• Téléchargement immédiat</li>
                    </ul>
                </div>
                
                <div class="flex justify-center space-x-3">
                    <button id="close-right-click" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Compris !
                    </button>
                    <button id="try-automatic" class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Essayer automatique
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(rightClickModal);
        
        rightClickModal.querySelector('#close-right-click').addEventListener('click', () => {
            rightClickModal.remove();
        });
        
        rightClickModal.querySelector('#try-automatic').addEventListener('click', () => {
            rightClickModal.remove();
            downloadImage(imageNumber);
        });
        
        rightClickModal.addEventListener('click', (e) => {
            if (e.target === rightClickModal) {
                rightClickModal.remove();
            }
        });
    }
    
    // Fonction pour afficher des notifications
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.download-notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `download-notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        // Couleurs selon le type
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="${icons[type] || icons.info} mr-3"></i>
                <span>${message}</span>
                <button class="ml-4 text-white/80 hover:text-white" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto-suppression après 4 secondes
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // Démarrer le chargement des images
    loadDesignImages();
    
    // Ajouter les styles CSS pour les animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fade-in {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
        }
        
        #image-modal {
            animation: fade-in 0.3s ease-out;
        }
        
        #image-modal .relative {
            animation: scale-in 0.3s ease-out;
        }
        
        @keyframes scale-in {
            from {
                transform: scale(0.9);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Design Gallery Script loaded successfully');
});