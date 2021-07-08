<template>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="24" :md="19" :lg="19" :xl="19">
      <!-- 顶部工具条 -->
      <div class="tools">
        <el-button size="mini" @click="save('xml')">保存为bmpn</el-button>
        <el-button size="mini" @click="save('svg')">保存为svg</el-button>
        <el-button size="mini" @click="handleBack">后退</el-button>
        <el-button size="mini" @click="handleAdvance">前进</el-button>
        <el-upload
          style="margin:0 10px;"
          :file-list="fileList"
          class="upload-demo"
          action
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleOnchangeFile"
        >
          <el-button size="mini">导入</el-button>
        </el-upload>
      </div>
      <!-- 画布 -->
      <div class="canvas" ref="canvas"></div>
    </el-col>
    <!-- 属性面板 -->
    <el-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
      <div id="js-properties-panel" class="panel"></div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted, inject, reactive } from "vue";
import { useRouter } from "vue-router";
import { xmlStr } from "@/assets/js/xmlStr";
import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda";
import customTranslate from "@/assets/js/customTranslate";

// 常量
const canvas = ref(null);
const msg = inject("$msg");
const route = useRouter();

//变量
// bpmn建模器
let bpmnModeler = reactive({});
let container = ref(null);
let xml = ref(null); // axios 读取url

let canvasName = ref(null);
let fileList = reactive([]);
// 函数
const init = () => {
  // 创建画布
  const curstom = {
    translate: ["value", customTranslate],
  };
  bpmnModeler = new BpmnModeler({
    container: canvas.value,
    propertiesPanel: {
      parent: "#js-properties-panel",
    },
    additionalModules: [
      // 右边的属性栏
      propertiesProviderModule,
      propertiesPanelModule,
      //汉化模块
      curstom,
    ],
    moddleExtensions: {
      camunda: camundaModdleDescriptor,
    },
  });
  createDiagram(bpmnModeler);
};

// 引入左侧工具栏及xml解析
const createDiagram = (bpmnModeler) => {
  let data = xml.value ? xml.value : xmlStr;
  try {
    let result = bpmnModeler.importXML(data);
    let { warnings } = result;
    // 图片适应
    let canvas = bpmnModeler.get("canvas");
    canvas.zoom("fit-viewport");
  } catch (err) {
    console.log(err.message, err.warnings);
  }
};

const save = async (type) => {
  if (type == "xml") {
    let result = await bpmnModeler.saveXML();
    let { xml } = result;
    setEncoded("flow.bpmn", xml);
  } else {
    let result = await bpmnModeler.saveSVG();
    let { svg } = result;
    setEncoded("flow.svg", svg);
  }
};

const setEncoded = (name, data) => {
  const encodedData = encodeURIComponent(data); // 把xml转换为URI
  if (data) {
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
    link.download = name;
    document.body.appendChild(link);
    link.click();
  }
};

const fileLoad = (filename) => {
  var reader = new FileReader();
  reader.onload = (evt) => {
    // 指定异步读写后触发的函数
    console.log(evt.target.result);
  };
  // reader.readAsText(filename, "gb2312");
};

const handleBack = () => {
  bpmnModeler.get("commandStack").undo();
};
const handleAdvance = () => {
  bpmnModeler.get("commandStack").redo();
};

const handleOnchangeFile = (file) => {
  const reader = new FileReader();
  let data = "";
  reader.readAsText(file.raw);
  reader.onload = (event) => {
    data = event.target.result;
    try {
      let result = bpmnModeler.importXML(data);
      let { warnings } = result;

      let canvas = bpmnModeler.get("canvas");
      canvas.zoom("fit-viewport");
      msg.success("导入成功");
    } catch (err) {
      msg.error("导入失败");
      console.log(err.message, err.warnings);
    }
  };
};

// 监听element
// const addEventBusListener = () => {
//   const eventBus = bpmnModeler.get("eventBus");
//   const eventTypes = [
//     "element.click",
//     "element.changed",
//     "element.updateLabel",
//   ];
//   eventTypes.forEach(function (eventType) {
//     eventBus.on(eventType, function (e) {
//       if (!e || e.element.type == "bpmn:Process") return;
//       if (eventType === "element.changed") {
//         // console.log("改变了了element", e);
//       } else if (eventType === "element.click") {
//         // console.log("点击了element", e);
//       } else if (eventType === "element.updateLabel") {
//         // console.log("更新了element  ", e.element);
//       }
//     });
//   });
// };

// 监听 modeler
// const addModelerListener = () => {
//   const bpmnjs = bpmnModeler;
//   const events = ["shape.added", "shape.move.end", "shape.removed"];
//   events.forEach(function (event) {
//     bpmnModeler.on(event, (e) => {
//       let elementRegistry = bpmnjs.get("elementRegistry");
//       let shape = e.element ? elementRegistry.get(e.element.id) : e.shape;

//       if (event === "shape.added") {
//         console.log("新增了shape");
//       } else if (event === "shape.move.end") {
//         console.log("移动了shape");
//       } else if (event === "shape.removed") {
//         console.log("删除了shape");
//       }
//     });
//   });
// };

onMounted(async () => {
  // 异步加载 xml文件
  //  xml.value = '异步加载的xml、bpmn';

  init(); // 初始化
  // 监听事件启动
  //   addEventBusListener();
  //   addModelerListener();
});
</script>


<style  lang='scss' scoped>
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "~bpmn-js/dist/assets/diagram-js.css"; // 左边工具栏以及编辑节点的样式
// @import "~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css"; //原本的右侧属性面板
@import "@/assets/css/bpmn-js-properties-panel.scss"; //右侧属性面板样式修复

.canvas {
  min-height: calc(100vh - 160px);
  height: 100%;
}
.panel {
  @extend .canvas;
}

.tools {
  padding: 15px 20px 0;
  display: flex;
}
</style>

