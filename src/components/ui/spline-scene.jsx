import { Suspense, lazy, Component } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) { console.warn('[SplineScene]', err?.message) }
  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}

export function SplineScene({ scene, className }) {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={null}>
        <Spline scene={scene} className={className} wasmPath="/spline-wasm/" />
      </Suspense>
    </ErrorBoundary>
  )
}
