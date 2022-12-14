import {
    BatchSpanProcessor, ConsoleSpanExporter, WebTracerProvider,
} from '@opentelemetry/sdk-trace-web';
import {SemanticResourceAttributes} from "@opentelemetry/semantic-conventions";
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {XMLHttpRequestInstrumentation} from '@opentelemetry/instrumentation-xml-http-request';
import {ZoneContextManager} from '@opentelemetry/context-zone';
import {registerInstrumentations} from '@opentelemetry/instrumentation';
import {DocumentLoadInstrumentation} from "@opentelemetry/instrumentation-document-load";
import {Resource} from "@opentelemetry/resources";

const resource = Resource.default().merge(new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: import.meta.env.VITE_OTEL_SERVICE_NAME,
}));

const providerWithZone = new WebTracerProvider({
    resource: resource,
});

console.log("Reached tracing!")
console.log(`Here is the env for OTel endpoint: ${import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT}`)

// env var parsing: https://vitejs.dev/guide/env-and-mode.html
providerWithZone.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter({
    serviceName: import.meta.env.VITE_OTEL_SERVICE_NAME,
    url: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
    insecure: false
})));

providerWithZone.addSpanProcessor(new BatchSpanProcessor(
    new ConsoleSpanExporter()
));

providerWithZone.register({
    contextManager: new ZoneContextManager()
});

providerWithZone.register();

registerInstrumentations({
    instrumentations: [new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: ['http://localhost:8090']
    }), new DocumentLoadInstrumentation],
});

const tracerWithZone = providerWithZone.getTracer("")

export {tracerWithZone};