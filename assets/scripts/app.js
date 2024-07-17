/* 
    O constructor() é um método especial para criar e inicializar um objeto criado a partir de uma classe. 

    this é uma referência ao objeto atual sobre o qual o código está sendo executado. Dentro de um método de uma classe, this refere-se à instância da classe.
*/
class Product{
    /* title = 'DEFAULT';
    description;
    price; */

    constructor(title, desc, price){
        this.title = title;
        this.description = desc;
        this.price = price;
    }
}

class ElementAttribute{
    constructor(attrName, attrValue){
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component{
    constructor(renderHookId, shouldRender = true){
        this.hookId = renderHookId;
        if(shouldRender){
           this.render();
        }
    }

    render(){}

    createRootElement(tag, cssClasses, attributes){
        const rootElement = document.createElement(tag);
        if(cssClasses){
            rootElement.className = cssClasses;
        }
        if(attributes && attributes.length > 0){
            for(const attr of attributes){
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class Cart extends Component{
    items = [];

    set cartItems(value){
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
    }
    get totalAmount(){
        const sum = this.items.reduce((prevValue,CurItem) => {
            return prevValue + CurItem.price;
        },0)

        return sum;
    }

    constructor(renderHookId){
        super(renderHookId);
    }

    addProduct(product){
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;
    }

    render(){
        const cartEl= this.createRootElement('section','cart');
        cartEl.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now!</button>
        `;
        this.totalOutput = cartEl.querySelector('h2');
    }
}

class ProductItem extends Component{
    constructor(product, renderHookId){
        super(renderHookId, false);
        this.product = product;
        this.render();
    }

     addToCart(){
        App.addProductToCart(this.product);
     }

    render(){                                   //  é uma função que cria um elemento HTML
            const prodEl = this.createRootElement('li','product-item');
            prodEl.innerHTML = `
                <div>
                    <div class="product-item__content">
                        <h2>${this.product.title}</h2>
                        <h3>\$${this.product.price}</h3>
                        <p>${this.product.description}</p>
                        <button>Add to Cart</button>
                    </div>
                </div>
            `;
        const addCartBtn = prodEl.querySelector('button');
        addCartBtn.addEventListener('click', this.addToCart.bind(this));
    }
}

class ProductList extends Component{
    products = [];

    constructor(renderHookId){
        super(renderHookId);
        this.fetchProducts();
    }

    fetchProducts(){
        this.products = [ 
        new Product('A Pillow', 'A soft pillow', 19.99),
        new Product('A Carpet', 'A Beautiful carpet', 90 )
        ];
        
        this.renderProducts();
    }
    
    renderProducts(){
        for(const prod of this.products){
            // Cria uma nova instância de ProductItem para cada produto
            new ProductItem(prod, 'prod-list');
        }
    }

    render(){

        this.createRootElement('ul', 'product-list', [new ElementAttribute('id','prod-list')]);

        if(this.products && this.products.length > 0){
            this.renderProducts();
        
        }
    }
    
}




class Shop{

    constructor(){
        this.render();
    }

    render(){
        this.cart = new Cart('app');                 
        new ProductList('app');
    }
}


class App{

    static cart;

    static init(){
        const shop = new Shop();
        this.cart = shop.cart;     
    }

    static addProductToCart(product){
        this.cart.addProduct(product);
    }
}

App.init();


