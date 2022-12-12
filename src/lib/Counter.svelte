<script>
    import {tracerWithZone} from "../tracing"
    import {context, trace} from "@opentelemetry/api";

    let count = 0

    const increment = () => {
        const incrementSpan = tracerWithZone.startSpan('Increment Counter');
        context.with(trace.setSpan(context.active(), incrementSpan), () => {
                trace.getSpan(context.active()).addEvent('Begin Increment');
                count += 1
                trace.getSpan(context.active()).addEvent('Increment Success');
            }
        )
    }
</script>

<button on:click={increment}>
    count is {count}
</button>
