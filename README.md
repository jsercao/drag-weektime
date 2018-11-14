## 使用

- Install

```sh
npm install drag-weektime
```

```
<template>
    <v-drag-weektime></v-drag-weektime>
</template>
```

- 全局使用

```vue
<script>
import VDragWeektime from 'drag-weektime';
import 'drag-weektime/dist/drag-weektime.css';

Vue.use(VDragWeektime);
</script>
```

- 组件内使用

```
<script>
import DragWeektime from 'drag-weektime';
import 'drag-weektime/dist/drag-weektime.css';

export default {
  components: { DragWeektime.name: DragWeektime },
  ...
};
</script>
```
