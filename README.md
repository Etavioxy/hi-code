# Hi Code

打印ACM模板用。

### Usage

```shell
node a.js [codedir]
```

### Docker

```shell
docker build -t hi-code .
docker run -it --name hi-code --rm \
  -v /path/to/your/codedir:/codedir -p 8080:8080 \
  hi-code /codedir
```

然后使用浏览器打开localhost:[port]，使用浏览器的打印功能。

---

### Features

文件末尾带有/**/的注释，会转化为markdown

使用.classify.json配置文件，可以实现分组。

```json
{
	"Data Structure I":[
		"stk",
		"que",
		"prior",
		...
	],
	"Data Structure II":[
	],
	"Data Structure III":[
	],
	"String":[
	],
	...
}
```
