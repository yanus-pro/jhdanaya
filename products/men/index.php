<?
define('COLLECTION_PAGE', 'Y');
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Мужчинам");
$elements_count = 6;
if ($_GET['show_all_elements']) $elements_count = 5000;
?><?
$arrFilter["PROPERTY_FOR"] = "men";
$arrFilter["PROPERTY_BRAND"] = false;
$SEF_FOLDER = "/products/men/";
include dirname(__FILE__) . "/../component_call.php";
?><?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
