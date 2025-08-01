import React, { useState, useRef } from 'react'

/**
 * Componente de testing para debuggear problemas de cámara
 * Úsalo temporalmente para identificar qué está causando el problema
 */
export const CameraTestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const addResult = (message: string) => {
    console.log(message)
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const runCompleteTest = async () => {
    setIsRunning(true)
    setTestResults([])
    
    try {
      addResult('🔍 Iniciando test completo de cámara...')

      // Test 1: Verificar APIs disponibles
      addResult('📋 Test 1: Verificando APIs disponibles')
      addResult(`navigator.mediaDevices: ${!!navigator.mediaDevices}`)
      addResult(`getUserMedia: ${!!navigator.mediaDevices?.getUserMedia}`)
      addResult(`enumerateDevices: ${!!navigator.mediaDevices?.enumerateDevices}`)
      
      if ('permissions' in navigator) {
        addResult('✅ Permissions API disponible')
        try {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
          addResult(`🔐 Estado permisos: ${permission.state}`)
        } catch (err) {
          addResult(`❌ Error permissions query: ${err}`)
        }
      } else {
        addResult('⚠️ Permissions API no disponible')
      }

      // Test 2: Listar dispositivos (sin permisos)
      addResult('📱 Test 2: Listando dispositivos (sin permisos)')
      try {
        const devices = await navigator.mediaDevices!.enumerateDevices()
        const videoDevices = devices.filter(d => d.kind === 'videoinput')
        addResult(`📹 Dispositivos de video encontrados: ${videoDevices.length}`)
        videoDevices.forEach((device, i) => {
          addResult(`  ${i + 1}. ${device.label || 'Sin nombre'} (${device.deviceId.substring(0, 10)}...)`)
        })
      } catch (err) {
        addResult(`❌ Error enumerateDevices: ${err}`)
      }

      // Test 3: Solicitar permisos básicos
      addResult('🔓 Test 3: Solicitando permisos básicos')
      try {
        const stream = await navigator.mediaDevices!.getUserMedia({ video: true })
        addResult('✅ Permisos básicos concedidos')
        addResult(`📊 Tracks en stream: ${stream.getTracks().length}`)
        
        stream.getTracks().forEach((track, i) => {
          addResult(`  Track ${i + 1}: ${track.kind} - ${track.label} - Estado: ${track.readyState}`)
        })
        
        stream.getTracks().forEach(track => track.stop())
        addResult('🛑 Stream básico cerrado')
      } catch (err: any) {
        addResult(`❌ Error getUserMedia básico: ${err.name} - ${err.message}`)
      }

      // Test 4: Listar dispositivos (con permisos)
      addResult('📱 Test 4: Listando dispositivos (con permisos)')
      try {
        const devices = await navigator.mediaDevices!.enumerateDevices()
        const videoDevices = devices.filter(d => d.kind === 'videoinput')
        addResult(`📹 Dispositivos con permisos: ${videoDevices.length}`)
        videoDevices.forEach((device, i) => {
          addResult(`  ${i + 1}. ${device.label || 'Sin nombre'} (${device.deviceId})`)
        })
      } catch (err) {
        addResult(`❌ Error enumerateDevices con permisos: ${err}`)
      }

      // Test 5: Probar cámara específica
      addResult('🎥 Test 5: Probando primera cámara disponible')
      try {
        const devices = await navigator.mediaDevices!.enumerateDevices()
        const videoDevices = devices.filter(d => d.kind === 'videoinput')
        
        if (videoDevices.length > 0) {
          const firstCamera = videoDevices[0]
          addResult(`🎯 Probando cámara: ${firstCamera.label || 'Sin nombre'}`)
          
          const stream = await navigator.mediaDevices!.getUserMedia({
            video: { deviceId: firstCamera.deviceId }
          })
          
          addResult('✅ Cámara específica funciona')
          
          // Mostrar video
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            streamRef.current = stream
            addResult('📺 Video asignado al elemento')
          }
          
        } else {
          addResult('❌ No hay cámaras disponibles para probar')
        }
      } catch (err: any) {
        addResult(`❌ Error probando cámara específica: ${err.name} - ${err.message}`)
      }

      addResult('🏁 Test completo finalizado')
      
    } catch (err) {
      addResult(`❌ Error general en test: ${err}`)
    } finally {
      setIsRunning(false)
    }
  }

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      addResult('🛑 Video detenido')
    }
  }

  const clearResults = () => {
    setTestResults([])
    stopVideo()
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          🔧 Herramienta de Testing de Cámara
        </h3>
      </div>
      <div className="card-body">
        <div className="d-flex gap-2 mb-4">
          <button 
            onClick={runCompleteTest}
            disabled={isRunning}
            className="btn btn-primary"
          >
            {isRunning ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Ejecutando Test...
              </>
            ) : (
              <>
                🚀 Ejecutar Test Completo
              </>
            )}
          </button>
          <button 
            onClick={stopVideo}
            className="btn btn-warning"
          >
            🛑 Detener Video
          </button>
          <button 
            onClick={clearResults}
            className="btn btn-secondary"
          >
            🗑️ Limpiar Resultados
          </button>
        </div>

        {/* Video de prueba */}
        <div className="mb-4">
          <video 
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '300px',
              backgroundColor: '#000',
              borderRadius: '8px'
            }}
          />
        </div>

        {/* Resultados */}
        <div className="bg-dark text-light p-3 rounded" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <h6 className="text-warning mb-3">📝 Resultados del Test:</h6>
          {testResults.length === 0 ? (
            <p className="text-muted">Haz clic en "Ejecutar Test Completo" para comenzar</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1" style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                {result}
              </div>
            ))
          )}
        </div>

        <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
          <h6 className="text-info">💡 Cómo usar esta herramienta:</h6>
          <ul className="mb-0">
            <li>Ejecuta el test completo para verificar todos los aspectos de la cámara</li>
            <li>Revisa los resultados en la consola negra</li>
            <li>Si el video aparece, la cámara funciona correctamente</li>
            <li>Envía los resultados del test para debugging</li>
          </ul>
        </div>
      </div>
    </div>
  )
}