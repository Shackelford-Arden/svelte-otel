<script>

    import opentelemetry from "@opentelemetry/api";
    import {context, trace} from "@opentelemetry/api";

    let count = 0
    const tracer = opentelemetry.trace.getTracer("counterTracer")

    const increment = () => {
        tracer.startActiveSpan('Increment Counter', span => {
            console.log("Triggered increment!")
            trace.getSpan(context.active()).addEvent('Begin Increment');
            count += 1
            trace.getSpan(context.active()).addEvent('Increment Success');
            span.end()
        });
        // context.with(trace.setSpan(context.active(), incrementSpan), () => {
        //         console.log("Triggered increment!")
        //         trace.getSpan(context.active()).addEvent('Begin Increment');
        //         count += 1
        //         trace.getSpan(context.active()).addEvent('Increment Success');
        //     }
        // )
    }
</script>

<button on:click={increment}>
    count is {count}
</button>
