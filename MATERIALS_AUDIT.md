# 素材迁入台账

这份台账记录“哪些文件已随项目发布、哪些仍在站外”的真实状态。它不是授权承诺：每一个外来文件在下载前都必须逐条核对作者、文件页和许可证。

## 本次迁入规则

- 只接收 **CC0、CC BY、CC BY-SA** 或明确公有领域的自然素材。
- 不接收 NC（非商业）或 ND（禁止演绎）素材。
- 每个文件必须保留：项目内路径、题目、作者、许可证、原始文件页、下载日期。
- 不复制或二次托管奥特曼、宝可梦的官方角色图或音频。

## 已随项目保存

| 测试 | 文件 | 许可证 | 来源页 |
| --- | --- | --- | --- |
| 蘑菇大师 | `public/media/mushrooms/ganoderma-lingzhi.png` | 原创生成素材（OpenAI 图像生成） | 无第三方素材页；生成提示和日期见 Git 历史 |
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
| 蘑菇大师 | 50 道题图仍在运行时请求 iNaturalist | 为每个物种筛选并下载一张合规图片，写入此台账后改成本地路径。 |
| 观鸟大师 | 50 道题图仍在运行时请求 iNaturalist | 同上。 |
| 昆虫侦探 | 50 道题图仍在运行时请求 iNaturalist | 同上。 |
| 鸟鸣识别 | 运行时从 Xeno-canto 转发 | 为每个物种逐条选择 CC0/CC BY/CC BY-SA 录音，再删除转发接口。 |
| 方言捕手 | 4 段音频仍为 Wikimedia 直链 | 下载并保存杭州、南京、广州、福州四段后替换链接。 |
| 外语猜国家 | 使用浏览器自带 `speechSynthesis`，没有站外音频 URL | 不依赖网站素材；后续可补可再利用真人录音以提升不同设备的一致性。 |

## 当前阻碍

当前电脑的命令行下载通道在向 Wikimedia、iNaturalist 等站请求文件时出现 Windows TLS 凭据错误；浏览器能读取文件页和授权信息，但命令行无法安全落盘。没有逐条下载和记录授权前，不能用随机图片替代，也不能把“候选”冒充成“已迁入”。
