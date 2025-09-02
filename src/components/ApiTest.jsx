import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({
    connection: null,
    vehicles: null,
    health: null,
    baseUrl: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mostrar a URL base configurada
    setTestResults(prev => ({
      ...prev,
      baseUrl: import.meta.env.VITE_API_URL || 'https://api.controllcar.com.br/api'
    }));
  }, []);

  const testConnection = async () => {
    setLoading(true);
    console.log('🧪 Iniciando teste de conexão com a API...');
    
    try {
      // Teste 1: Verificar conexão básica
      console.log('📡 Testando conexão básica...');
      const connectionResult = await ApiService.testConnection();
      console.log('✅ Resultado da conexão:', connectionResult);
      
      setTestResults(prev => ({ ...prev, connection: connectionResult }));

      // Teste 2: Tentar buscar veículos
      console.log('🚗 Testando endpoint de veículos...');
      try {
        const vehicles = await ApiService.getVehicles();
        console.log('✅ Veículos encontrados:', vehicles);
        setTestResults(prev => ({ ...prev, vehicles: { success: true, count: vehicles?.length || 0, data: vehicles } }));
      } catch (vehicleError) {
        console.error('❌ Erro ao buscar veículos:', vehicleError);
        setTestResults(prev => ({ 
          ...prev, 
          vehicles: { 
            success: false, 
            error: vehicleError.message,
            status: vehicleError.response?.status,
            statusText: vehicleError.response?.statusText
          } 
        }));
      }

      // Teste 3: Tentar endpoint de health
      console.log('💓 Testando endpoint de health...');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
        const healthData = await response.json();
        console.log('✅ Health check:', healthData);
        setTestResults(prev => ({ 
          ...prev, 
          health: { 
            success: true, 
            status: response.status, 
            data: healthData 
          } 
        }));
      } catch (healthError) {
        console.error('❌ Erro no health check:', healthError);
        setTestResults(prev => ({ 
          ...prev, 
          health: { 
            success: false, 
            error: healthError.message 
          } 
        }));
      }

    } catch (error) {
      console.error('❌ Erro geral no teste:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (result, title) => {
    if (result === null) return <div className="text-gray-500">Não testado</div>;
    
    if (typeof result === 'string') {
      return <div className="text-blue-600">{result}</div>;
    }

    if (result.success === true) {
      return (
        <div className="text-green-600">
          ✅ Sucesso
          {result.count !== undefined && <div>Registros: {result.count}</div>}
          {result.status && <div>Status: {result.status}</div>}
        </div>
      );
    }

    if (result.success === false) {
      return (
        <div className="text-red-600">
          ❌ Erro: {result.error}
          {result.status && <div>Status HTTP: {result.status}</div>}
          {result.statusText && <div>Status Text: {result.statusText}</div>}
        </div>
      );
    }

    if (result.connected !== undefined) {
      return (
        <div className={result.connected ? "text-green-600" : "text-red-600"}>
          {result.connected ? '✅ Conectado' : '❌ Desconectado'}
          {result.status && <div>Status: {result.status}</div>}
          {result.fallback && <div>⚠️ Usando fallback</div>}
          {result.error && <div>Erro: {result.error}</div>}
        </div>
      );
    }

    return <div className="text-gray-600">{JSON.stringify(result, null, 2)}</div>;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Teste de Comunicação com API</h1>
      
      <div className="mb-6">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? '🔄 Testando...' : '🚀 Executar Testes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">📍 URL Base da API</h3>
          {renderResult(testResults.baseUrl, 'URL Base')}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">🔗 Teste de Conexão</h3>
          {renderResult(testResults.connection, 'Conexão')}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">🚗 Endpoint de Veículos</h3>
          {renderResult(testResults.vehicles, 'Veículos')}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">💓 Health Check</h3>
          {renderResult(testResults.health, 'Health')}
        </div>
      </div>

      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">📋 Logs do Console</h3>
        <p className="text-sm text-gray-600">
          Abra o console do navegador (F12) para ver logs detalhados dos testes.
        </p>
      </div>
    </div>
  );
};

export default ApiTest;