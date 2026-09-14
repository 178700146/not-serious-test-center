# 素材迁入台账

这份台账记录“哪些文件已随项目发布、哪些仍在站外”的真实状态。它不是授权承诺：每一个外来文件在下载前都必须逐条核对作者、文件页和许可证。

截至 2026-09-11，蘑菇、鸟类、昆虫三组共 150 道题的图片已迁入项目内 WebP：149 张来自 iNaturalist 的 CC0/CC BY/CC BY-SA 观察照片，另 1 张来自 Wikimedia Commons 的 CC BY-SA 3.0 文件。完整的作者、许可证、来源页和本地路径记录在 `lib/natural-media.json`；失败清单为 `lib/natural-media-failures.json`。

## 本次迁入规则

- 只接收 **CC0、CC BY、CC BY-SA** 或明确公有领域的自然素材。
- 不接收 NC（非商业）或 ND（禁止演绎）素材。
- 每个文件必须保留：项目内路径、题目、作者、许可证、原始文件页、下载日期。
- 不复制或二次托管奥特曼、宝可梦的官方角色图或音频。

## 已随项目保存

| 测试 | 文件 | 许可证 | 来源页 |
| --- | --- | --- | --- |
| 蘑菇大师 | `public/media/natural/mushrooms/*.webp` | 逐条见 `lib/natural-media.json`（CC0/CC BY/CC BY-SA） | iNaturalist 观察照片；`Termitomyces albuminosus` 使用 Wikimedia Commons 文件页 |
| 方言捕手 | `public/audio/dialect/beijing.ogg` | CC BY-SA 3.0 | [北京样音](https://commons.wikimedia.org/wiki/File:Zh-dialect_Beijing_sample.ogg) |
| 方言捕手 | `public/audio/dialect/tianjin.oga` | CC0 | [天津样音](https://commons.wikimedia.org/wiki/File:Zh,_cmn,_jlua,_Tianjin_dialect_(Hexi),_维基百科,_自由的百科全书.oga) |
| 方言捕手 | `public/audio/dialect/hebei.oga` | CC0 | [邯郸样音](https://commons.wikimedia.org/wiki/File:Zh,_cmn,_jlua,_Handan_Dialect,_维基百科,_自由的百科全书.oga) |
| 方言捕手 | `public/audio/dialect/shandong.oga` | CC BY-SA 4.0 | [济南样音](https://commons.wikimedia.org/wiki/File:Zh,_cmn,_jlua,_Jinan_Dialect,_维基百科,_自由的百科全书.oga) |
| 方言捕手 | `public/audio/dialect/chongqing.opus` | CC BY-SA 4.0 | [重庆样音](https://commons.wikimedia.org/wiki/File:Zh,_cmn,_cyuc,_Chongqing_dialect,_维基百科,_自由的百科全书.opus) |
| 方言捕手 | `public/audio/dialect/guizhou.oga` | CC BY-SA 4.0 | [贵阳样音](https://commons.wikimedia.org/wiki/File:Zh,_cmn,_xghu,_Guiyang_Dialect,_维基百科,_自由的百科全书.oga) |

## 已核实、可作为鸟鸣候选

| 题目 | 候选文件 | 作者 | 许可证 | 说明 |
| --- | --- | --- | --- | --- |
| 戴胜 / *Upupa epops* | [Upupa epops.ogg](https://commons.wikimedia.org/wiki/File:Upupa_epops.ogg) | Vladimir Yu. Arkhipov（Arkhivov） | CC BY-SA 3.0 | 7.2 秒；文件页已核验。 |

## 尚未迁入，不能说成已本地化

| 测试 | 现状 | 下一步 |
| --- | --- | --- |
| 蘑菇大师 | 50 道题图已本地化为 `public/media/natural/mushrooms/*.webp` | 已完成；运行时仅在本地文件缺失时保留合规来源的兜底请求。 |
| 观鸟大师 | 50 道题图已本地化为 `public/media/natural/birds/*.webp` | 已完成；运行时仅在本地文件缺失时保留合规来源的兜底请求。 |
| 昆虫侦探 | 50 道题图已本地化为 `public/media/natural/insects/*.webp` | 已完成；运行时仅在本地文件缺失时保留合规来源的兜底请求。 |
| 鸟鸣识别 | 运行时从 Xeno-canto 转发 | 为每个物种逐条选择 CC0/CC BY/CC BY-SA 录音，再删除转发接口。 |
| 方言捕手 | 4 段音频仍为 Wikimedia 直链 | 下载并保存杭州、南京、广州、福州四段后替换链接。 |
| 外语猜国家 | 使用浏览器自带 `speechSynthesis`，没有站外音频 URL | 不依赖网站素材；后续可补可再利用真人录音以提升不同设备的一致性。 |

## 当前仍在站外的素材

自然图片已不再依赖运行时 iNaturalist 请求。仍在站外的只有鸟鸣识别的 Xeno-canto 音频，以及方言捕手的 4 段 Wikimedia 音频；这些没有在本次迁移中冒充成本地素材。
