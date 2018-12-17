"use strict";

/* Imports usados */
require("chromedriver");
const webDriver = require("selenium-webdriver");
const Mongo = require("./Services/database");

/* Função de Scrapping */
(async () => {
  try {
    /* buildando o driver| Demo o require do drive ali em cima. */
    const driver = new webDriver.Builder().forBrowser("chrome").build();
    /* Arrumando a tela para que fique no tamanho de site normal, caso contrário vai para a de celular e os elementos mudam... */
    await driver
      .manage()
      .window()
      .setRect({ width: 1366, height: 768 });
    /* Página QUe desejamos acessar */
    await driver.get("https://www.olx.com.br/");
    /* Ao acessar página inicial OLX, escolhemos no mapa a cidade de São Paulo | Obs: Escolha a que quiser */
    await driver.findElement(webDriver.By.id("state-sp")).click();
    /* Aguardamos três segundos para esperar o carregamento total da página */
    await driver.sleep(3000);
    /* Uma vez que a página carregou, pesquisamos no search text a palavra chave Nissan March | Obs: Pesquise pelo que quiser */
    await driver
      .findElement(webDriver.By.id("searchtext"))
      .sendKeys("Nissan March SV");
    /* Após escrevermos o que queremos pesquisar acionamoso botão de pesquisa */
    await driver.findElement(webDriver.By.id("searchbutton")).click();
    /* Aguardamos por mais 3 segundos até que a página com nossa pesquisa apareça totalmente */
    await driver.sleep(3000);

    /* Aqui pegamos todos os itens da lista da primeira página */
    const itens = await driver.findElements(
      webDriver.By.className("OLXad-list-link")
    );
    /*Abrimos conexão com o banco de dados */
    const database = new Mongo(await Mongo.connection());
    /* Aqui fazemos um for para pegar informação de cada item dessa lista | Info geral + Url Anúncio */
    for (let i = 0; i <= itens.length - 1; i++) {
      const item = itens[i];
      /* Aqui estamos extraindo os valores de texto, ou seja, as informações */
      const information = await item.getText();
      /* Aqui estamos recebendo a url do anúnicio */
      const url = await item.getAttribute("href");
      /* Criamos um JSON para salvar no MongoDB */
      const info = {
        information,
        url
      };
      /* Inserção de cada anúncio no banco de dados */
      await database.insertSearch(info);
    }
    console.log("Finalizou");
    /* Aqui matamos o driver finalizando nosso webscrapping */
    await driver.quit();
  } catch (error) {
    console.log("Error ao executar função ", error);
  }
})();
