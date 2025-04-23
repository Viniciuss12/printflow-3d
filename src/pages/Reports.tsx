import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useCardContext } from '../contexts/CardContext';
import { formatCurrency } from '../utils/formatters';

// Cores para os gráficos
const STATUS_COLORS = {
  'Solicitado': '#9e9e9e',
  'Aprovado': '#1976d2',
  'Fila de Produção': '#ff9800',
  'Em Produção': '#03a9f4',
  'Finalizado': '#4caf50'
};

const Reports: React.FC = () => {
  const { cards, loading, error } = useCardContext();
  const [tabValue, setTabValue] = useState(0);
  
  // Dados para os relatórios
  const [statusData, setStatusData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [costAnalysisData, setCostAnalysisData] = useState<any[]>([]);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  const [totalLoss, setTotalLoss] = useState<number>(0);
  const [profitableCount, setProfitableCount] = useState<number>(0);
  const [unprofitableCount, setUnprofitableCount] = useState<number>(0);
  
  // Processar dados para os relatórios
  useEffect(() => {
    if (cards.length > 0) {
      // Dados por status
      const statusCounts: Record<string, number> = {};
      cards.forEach(card => {
        statusCounts[card.status] = (statusCounts[card.status] || 0) + 1;
      });
      
      const statusDataArray = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status],
        color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#000000'
      }));
      setStatusData(statusDataArray);
      
      // Dados por departamento
      const departmentCounts: Record<string, number> = {};
      cards.forEach(card => {
        departmentCounts[card.department] = (departmentCounts[card.department] || 0) + 1;
      });
      
      const departmentDataArray = Object.keys(departmentCounts).map((dept, index) => ({
        name: dept,
        value: departmentCounts[dept],
        color: '#' + Math.floor(Math.random()*16777215).toString(16) // Cor aleatória
      }));
      setDepartmentData(departmentDataArray);
      
      // Análise de custo
      const finishedCards = cards.filter(card => 
        card.status === 'Finalizado' && 
        card.partValue !== undefined && 
        card.printingCost !== undefined
      );
      
      let totalSavingsValue = 0;
      let totalLossValue = 0;
      let profitableCards = 0;
      let unprofitableCards = 0;
      
      finishedCards.forEach(card => {
        if (card.isProfitable) {
          totalSavingsValue += card.profitLoss || 0;
          profitableCards++;
        } else {
          totalLossValue += Math.abs(card.profitLoss || 0);
          unprofitableCards++;
        }
      });
      
      setTotalSavings(totalSavingsValue);
      setTotalLoss(totalLossValue);
      setProfitableCount(profitableCards);
      setUnprofitableCount(unprofitableCards);
      
      // Dados para tabela de análise de custo
      setCostAnalysisData(finishedCards.map(card => ({
        id: card.id,
        title: card.title,
        partName: card.partName,
        partValue: card.partValue || 0,
        printingCost: card.printingCost || 0,
        profitLoss: card.profitLoss || 0,
        isProfitable: card.isProfitable
      })));
    }
  }, [cards]);
  
  // Função para lidar com mudança de aba
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Renderizar estado de carregamento
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Renderizar mensagem de erro
  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Relatórios e Análises
      </Typography>
      
      {cards.length === 0 ? (
        <Alert severity="info">
          Não há dados suficientes para gerar relatórios. Crie algumas solicitações primeiro.
        </Alert>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Visão Geral" />
              <Tab label="Análise por Departamento" />
              <Tab label="Análise de Custo-Benefício" />
            </Tabs>
          </Box>
          
          {/* Aba de Visão Geral */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <React.Fragment>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Solicitações por Status
                    </Typography>
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Gráfico de pizza com distribuição de status
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </React.Fragment>
              
              <React.Fragment>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Resumo de Solicitações
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        {statusData.map((status) => (
                          <React.Fragment key={status.name}>
                            <Grid item xs={6}>
                              <Card sx={{ bgcolor: status.color, color: 'white' }}>
                                <CardContent>
                                  <Typography variant="h5" component="div">
                                    {status.value}
                                  </Typography>
                                  <Typography variant="body2">
                                    {status.name}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </Grid>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1">
                      Total de Solicitações: <strong>{cards.length}</strong>
                    </Typography>
                  </Paper>
                </Grid>
              </React.Fragment>
              
              <React.Fragment>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Solicitações por Status
                    </Typography>
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Gráfico de barras com quantidade por status
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </React.Fragment>
            </Grid>
          )}
          
          {/* Aba de Análise por Departamento */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <React.Fragment>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Solicitações por Departamento
                    </Typography>
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Gráfico de pizza com distribuição por departamento
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </React.Fragment>
              
              <React.Fragment>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Resumo por Departamento
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Departamento</TableCell>
                            <TableCell align="right">Quantidade</TableCell>
                            <TableCell align="right">Percentual</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {departmentData.map((row) => (
                            <TableRow key={row.name}>
                              <TableCell component="th" scope="row">
                                {row.name}
                              </TableCell>
                              <TableCell align="right">{row.value}</TableCell>
                              <TableCell align="right">
                                {((row.value / cards.length) * 100).toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </React.Fragment>
              
              <React.Fragment>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Solicitações por Departamento
                    </Typography>
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Gráfico de barras com quantidade por departamento
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </React.Fragment>
            </Grid>
          )}
          
          {/* Aba de Análise de Custo-Benefício */}
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <React.Fragment>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Resumo de Economia
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <React.Fragment>
                          <Grid item xs={6}>
                            <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
                              <CardContent>
                                <Typography variant="h5" component="div">
                                  {formatCurrency(totalSavings)}
                                </Typography>
                                <Typography variant="body2">
                                  Economia Total
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </React.Fragment>
                        <React.Fragment>
                          <Grid item xs={6}>
                            <Card sx={{ bgcolor: '#f44336', color: 'white' }}>
                              <CardContent>
                                <Typography variant="h5" component="div">
                                  {formatCurrency(totalLoss)}
                                </Typography>
                                <Typography variant="body2">
                                  Prejuízo Total
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </React.Fragment>
                        <React.Fragment>
                          <Grid item xs={6}>
                            <Card sx={{ bgcolor: '#2196f3', color: 'white' }}>
                              <CardContent>
                                <Typography variant="h5" component="div">
                                  {profitableCount}
                                </Typography>
                                <Typography variant="body2">
                                  Impressões Lucrativas
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </React.Fragment>
                        <React.Fragment>
                          <Grid item xs={6}>
                            <Card sx={{ bgcolor: '#ff9800', color: 'white' }}>
                              <CardContent>
                                <Typography variant="h5" component="div">
                                  {unprofitableCount}
                                </Typography>
                                <Typography variant="body2">
                                  Impressões não Lucrativas
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </React.Fragment>
                      </Grid>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1">
                      Economia Líquida: <strong>{formatCurrency(totalSavings - totalLoss)}</strong>
                    </Typography>
                  </Paper>
                </Grid>
              </React.Fragment>
              
              <React.Fragment>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Distribuição de Lucratividade
                    </Typography>
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="body1">
                        Gráfico de pizza com distribuição de lucratividade
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </React.Fragment>
              
              <React.Fragment>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Análise Detalhada de Custo-Benefício
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Peça</TableCell>
                            <TableCell align="right">Valor Original</TableCell>
                            <TableCell align="right">Custo Impressão</TableCell>
                            <TableCell align="right">Ganho/Prejuízo</TableCell>
                            <TableCell align="right">Resultado</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {costAnalysisData.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell component="th" scope="row">
                                {row.title}
                              </TableCell>
                              <TableCell>{row.partName}</TableCell>
                              <TableCell align="right">{formatCurrency(row.partValue)}</TableCell>
                              <TableCell align="right">{formatCurrency(row.printingCost)}</TableCell>
                              <TableCell 
                                align="right"
                                sx={{ 
                                  color: row.isProfitable ? 'success.main' : 'error.main',
                                  fontWeight: 'bold'
                                }}
                              >
                                {formatCurrency(row.profitLoss)}
                              </TableCell>
                              <TableCell align="right">
                                {row.isProfitable ? 'Economia' : 'Prejuízo'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </React.Fragment>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default Reports;
