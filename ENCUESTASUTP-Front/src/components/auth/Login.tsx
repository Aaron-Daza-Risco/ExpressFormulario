// src/components/auth/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  Select,
  MenuItem,
  Paper,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  InputLabel,
  FormControl
} from '@mui/material';
import { Visibility, VisibilityOff, Person, School, AdminPanelSettings, Lock } from '@mui/icons-material';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';

export const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    tipo: 'student' as 'admin' | 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(
        credentials.username,
        credentials.password,
        credentials.tipo
      );
      console.log('Respuesta de login:', response);
      login(response);
      navigate(credentials.tipo === 'admin' ? '/admin' : '/student');
    } catch {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'URL(/UTP-PORTAL.jpg)', // Ruta relativa desde la carpeta public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Superposición semitransparente para contraste
          zIndex: 1,
        },
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={6}
          sx={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.9)', // Fondo semi-transparente para el formulario
          }}
        >
          {/* Logo de la UTP */}
          <Box sx={{ mb: 2 }}>
            <img src="/logo-visualizate.png" alt="Logo UTP" width="100" />
          </Box>

          {credentials.tipo === 'admin' ? (
            <AdminPanelSettings sx={{ fontSize: 45, mb: 2, color: '#E31837' }} />
          ) : (
            <School sx={{ fontSize: 45, mb: 2, color: '#E31837' }} />
          )}

          <Typography 
            component="h1" 
            variant="h5" 
            gutterBottom
            sx={{ color: '#E31837', fontWeight: 'bold' }}
          >
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: '100%', 
                mb: 2,
                '& .MuiAlert-icon': {
                  color: '#E31837'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Usuario"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#E31837' }}/>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#E31837',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#E31837',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#E31837',
                }
              }}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#E31837' }}/>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#E31837' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#E31837',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#E31837',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#E31837',
                }
              }}
              disabled={loading}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#E31837' }}>Tipo de Usuario</InputLabel>
              <Select
                value={credentials.tipo}
                label="Tipo de Usuario"
                onChange={(e) => setCredentials({
                  ...credentials,
                  tipo: e.target.value as 'admin' | 'student'
                })}
                sx={{ 
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E31837',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E31837',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E31837',
                  },
                  '& .MuiSvgIcon-root ': {
                    fill: '#E31837 !important',
                  },
                  color: '#E31837',
                  '& .MuiInputLabel-root': {
                    color: '#E31837',
                  },
                }}
                IconComponent={() => <ArrowDropDownIcon sx={{ color: '#E31837' }}/> }
              >
                <MenuItem value="student">Estudiante</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                position: 'relative',
                backgroundColor: '#E31837',
                '&:hover': {
                  backgroundColor: '#C41230',
                },
                color: '#FFFFFF',
                fontWeight: 'bold'
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: '#FFFFFF',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
