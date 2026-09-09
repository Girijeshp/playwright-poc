class productPage{
    constructor(page){
        this.page = page;
        this.inventoryCard = page.locator('.inventory_item');// locate the inventory list on the page
        this.addToCartButton = page.getByRole('button',{name:'Add to cart'});// locate the add to cart button using its role and name
    }
    async getProductCount(){
            const productcount = await this.inventoryCard.count();// count the number of products in the inventory list
            console.log(`Number of products in the inventory: ${productcount}`);// print the number of products in the console
            return productcount;
        }
        async addProductToCart(productName){
            const count = await this.getProductCount();
            for(let i=0;i<count;i++){
                const product = await this.inventoryCard.nth(i);
                const name = await product.locator('.inventory_item_name').textContent();
                if(name.trim() === productName){
                    console.log(`Product found: ${name.trim()}`);// check if the product name matches the expected value and print it in the console
                    await this.addToCartButton.nth(i).click();// click on the add to cart button for the product
                }
               }
               await this.page.pause();// pause the test execution to inspect the page  
           }
    }
module.exports = productPage;