import '../App.css';
import Categories from '../components/Categories';
import Inputs from '../components/Inputs';
import Directions from '../components/Instructions';


function Set(){
    return(
        <div id="IncomePage">
            <Inputs/>
            <Categories/>
            <Directions/>
        </div>
    );
}

export default Set;