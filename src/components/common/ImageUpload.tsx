import React from 'react';
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ImageUploadProps {
  label: string;
  onImageSelected: (file: File | null) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, onImageSelected, disabled = false }) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Limpar preview quando o componente é desmontado
  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      
      setSelectedFile(file);
      onImageSelected(file);
      
      // Criar preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    onImageSelected(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        label={label}
        value={selectedFile ? selectedFile.name : ''}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <CloudUploadIcon />
            </InputAdornment>
          ),
        }}
        disabled={disabled}
        sx={{ mb: 1 }}
      />
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={fileInputRef}
        disabled={disabled}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button
          variant="outlined"
          onClick={handleButtonClick}
          disabled={disabled}
        >
          Selecionar Imagem
        </Button>
        
        {selectedFile && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearImage}
            disabled={disabled}
          >
            Limpar
          </Button>
        )}
      </Box>
      
      {preview && (
        <Box 
          sx={{ 
            mt: 2, 
            width: '100%', 
            height: 200, 
            backgroundImage: `url(${preview})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            border: '1px solid #ccc',
            borderRadius: 1
          }} 
        />
      )}
    </Box>
  );
};

export default ImageUpload;
