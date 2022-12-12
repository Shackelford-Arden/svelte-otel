import { env } from 'node:process';
import {
    BatchSpanProcessor, ConsoleSpanExporter, WebTracerProvider,
} from '@opentelemetry/sdk-trace-web';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {XMLHttpRequestInstrumentation} from '@opentelemetry/instrumentation-xml-http-request';
import {ZoneContextManager} from '@opentelemetry/context-zone';
import {registerInstrumentations} from '@opentelemetry/instrumentation';
import {DocumentLoadInstrumentation} from "@opentelemetry/instrumentation-document-load";

const providerWithZone = new WebTracerProvider();
providerWithZone.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter(
    {
        serviceName: env.OTEL_SERVICE_NAME,
        url: env.OTEL_EXPORTER_OTLP_ENDPOINT,
        insecure: true
    }
)));
providerWithZone.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));

providerWithZone.register({
    contextManager: new ZoneContextManager()
});

providerWithZone.register();

registerInstrumentations({
    instrumentations: [
        new XMLHttpRequestInstrumentation({
            propagateTraceHeaderCorsUrls: ['http://localhost:8090']
        }),
        new DocumentLoadInstrumentation],
});

const tracerWithZone = providerWithZone.getTracer("")

export {tracerWithZone};