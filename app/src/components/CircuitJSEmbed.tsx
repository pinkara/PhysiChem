import { CircuitJS } from './CircuitJS';

interface CircuitJSEmbedProps {
  height?: string;
  circuit?: string;
  format?: string;
  url?: string;
  controls?: string;
}

export function CircuitJSEmbed({ 
  height = '850px',
  circuit,
  format,
  url,
  controls = 'true'
}: CircuitJSEmbedProps) {
  console.log('CircuitJSEmbed props:', { height, circuit: circuit?.slice(0, 50), format, url, controls });
  return (
    <div className="my-4">
      <CircuitJS 
        height={height}
        circuit={circuit}
        format={format as 'cct' | 'ctz'}
        url={url}
        controls={controls === 'true'}
      />
    </div>
  );
}
