const tablaDeMultiplicar = (valor) =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((devuelve, i) => {
    devuelve.push(valor * i);
    return devuelve;
  }, []);

console.log(tablaDeMultiplicar(1));
