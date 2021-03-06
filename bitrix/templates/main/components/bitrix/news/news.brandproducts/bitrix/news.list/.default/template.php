<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>

<?
$show = $_GET["show"] ? $_GET["show"] : false;
$itemCount = 6;
$onPage = count($arResult["ITEMS"]);
global $arrFilter, $currentBrendID;
?>

<ul class="collection_list brand">
<?foreach($arResult["ITEMS"] as $Item){?>
	<li id="bx_id_<?=$Item["ID"]?>">
		<a href="<?=$Item["DETAIL_PICTURE"]["SRC"]?>" class="preview">
			<img alt="<?=$Item["PREVIEW_PICTURE"]["DESCRIPTION"]
				?>" src="<?=$Item["PREVIEW_PICTURE"]["SRC"]?>" />
		</a>
		<div class="info detail">
			<div class="text">
				<?if($Item["DISPLAY_PROPERTIES"]["ARTICLE"]["VALUE"]){?>
					<p><?=GetMessage("ART.")?>&nbsp;<?=$Item["DISPLAY_PROPERTIES"]["ARTICLE"]["VALUE"]?></p>
				<?}?>
				<?=$Item["PREVIEW_TEXT"]?>
				<?if($Item['SHOP']):?>
					<p class="shop_info">
						<?=$Item['SHOP']['NAME']?>
						<?if($Item['SHOP']['PHONE']):?>
							<br/>
							<?=GetMessage('PHONE')?>
							<?=$Item['SHOP']['PHONE']?>
						<?endif?>
					</p>
				<?endif?>
			</div>
			<?if($Item["DETAIL_PICTURE"]){?>
				<img class="picture" alt="<?=$Item["DETAIL_PICTURE"]["DESCRIPTION"]
					?>" src="<?=$Item["DETAIL_PICTURE"]["SRC"]?>" />
			<?}?>
		</div>
		<div class="info hover">
			<div class="text">
				<?if($Item["DISPLAY_PROPERTIES"]["ARTICLE"]["VALUE"]){?>
					<p><?=GetMessage("ART.")?>&nbsp;<?=$Item["DISPLAY_PROPERTIES"]["ARTICLE"]["VALUE"]?></p>
				<?}?>
				<?=$Item["PREVIEW_TEXT"]?>
			</div>
		</div>
	</li>
<?}?>
</ul>

<?$arFilter = array(
	"ACTIVE" => "Y",
	"IBLOCK_ID" => $arResult["ID"],
);
if($arResult["SECTION"]["PATH"][0]["ID"]){
	$arFilter["SECTION_ID"] = $arResult["SECTION"]["PATH"][0]["ID"];
}else{
	$path = $APPLICATION->GetCurPage();
	$path = explode("/", $path);

	if(count($path) >= 4 && $path[3]){
		$section_code = $path[3];

		$rs_section = CIBlockSection::GetList(
			array(),
			array(
				"IBLOCK_TYPE" => "lists",
				"IBLOCK_CODE" => "catalog",
				"CODE" => $section_code
			)
		);
		$ar_secrion = $rs_section->GetNext();

		$arFilter["SECTION_ID"] = $ar_secrion["ID"];
	}
}
if($arrFilter["PROPERTY_FOR"]){
	$arFilter["PROPERTY_FOR"] = $arrFilter["PROPERTY_FOR"];
}
$arFilter["PROPERTY_BRAND"] = $currentBrendID;

$total = CIBlockElement::GetList(
	array(),
	$arFilter,
	false,
	array(),
	array()
);
$totalcount = $total->SelectedRowsCount();

$all_link = '';
foreach($_GET as $k=>$v) $all_link .= '&'.$k.'='.$v;
$all_link .= '&show_all_elements=Y';
$all_link = '?'.substr($all_link, 1);

if(count($arResult["ITEMS"]) && count($arResult["ITEMS"]) < $totalcount){?>
	<a class="load_more" href="<?=$all_link?>" title="<?=GetMessage("SHOW_MORE")
		?>" data-next-page="2" data-count="<?=$itemCount
		?>" data-iblock-section="<?=$arFilter["SECTION_ID"]
		?>" data-brand="<?=$currentBrendID
		?>" data-for="<?=$arrFilter["PROPERTY_FOR"]
		?>" data-iblock="catalog"><span><?=GetMessage("SHOW_MORE")
		?></span></a>
<?}?>
