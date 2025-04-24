import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { sharePointService } from '../services/sharePointService';

export interface ImageUploadProps {
  imageUrl?: string;
  onImageUpload: (url: string | undefined) => void;
  imageType: string;
  label?: string;
  currentImageUrl?: string;
  onImageUploaded?: (url: string) => Promise<void>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  imageUrl, 
  onImageUpload, 
  imageType, 
  label, 
  currentImageUrl, 
  onImageUploaded 
}) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadDisabled] = useState(true); // Temporariamente desabilitado
  
  // Usar currentImageUrl se fornecido, caso contrário usar imageUrl
  const displayImageUrl = currentImageUrl || imageUrl;
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Obter token de autenticação
      const token = await getToken();
      
      // Configurar o serviço do SharePoint com o token
      sharePointService.setAuthToken(token);
      
      // Fazer upload da imagem
      const uploadedUrl = await sharePointService.uploadImage(file, imageType);
      
      // Atualizar o estado com a URL da imagem
      if (onImageUploaded) {
        await onImageUploaded(uploadedUrl);
      } else if (onImageUpload) {
        onImageUpload(uploadedUrl);
      }
    } catch (err: any) {
      console.error('Erro ao fazer upload da imagem:', err);
      setError('Recurso de upload de imagens temporariamente indisponível.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveImage = () => {
    if (onImageUpload) {
      onImageUpload(undefined);
    }
  };
  
  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      {label && (
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
      )}
      
      {displayImageUrl ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box 
            component="img" 
            src={displayImageUrl} 
            alt={`Imagem de ${imageType}`}
            sx={{ 
              maxWidth: '100%', 
              maxHeight: 200, 
              objectFit: 'contain',
              mb: 1,
              border: '1px solid #ddd',
              borderRadius: 1
            }}
          />
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={handleRemoveImage}
          >
            Remover Imagem
          </Button>
        </Box>
      ) : (
        <Box sx={{ 
          border: '2px dashed #ccc', 
          borderRadius: 1, 
          p: 2, 
          textAlign: 'center',
          bgcolor: '#f9f9f9'
        }}>
          {uploadDisabled ? (
            <Typography variant="body2" color="text.secondary">
              Upload de imagens temporariamente indisponível.
            </Typography>
          ) : (
            <>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id={`upload-image-${imageType}`}
                type="file"
                onChange={handleFileChange}
                disabled={loading || uploadDisabled}
              />
              <label htmlFor={`upload-image-${imageType}`}>
                <Button 
                  variant="contained" 
                  component="span"
                  disabled={loading || uploadDisabled}
                >
                  {loading ? <CircularProgress size={24} /> : 'Selecionar Imagem'}
                </Button>
              </label>
              
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Formatos aceitos: JPG, PNG, GIF
              </Typography>
            </>
          )}
          
          {error && (
            <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
