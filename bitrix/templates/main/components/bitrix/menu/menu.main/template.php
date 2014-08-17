<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>

<?if (!empty($arResult)):?>

<?foreach($arResult as $arItem):?>
	<?if($arParams["MAX_LEVEL"] == 1 && $arItem["DEPTH_LEVEL"] > 1) continue;?>
	<?if($APPLICATION->GetCurPage() !== SITE_DIR && $arItem["LINK"] == SITE_DIR):?>
		<?$arItem["LINK"] = $arItem["LINK"] . "#brands";?>
	<?endif;?>
	<?if($arItem["SELECTED"]):?>
		<?if($arItem["LINK"] != $APPLICATION->GetCurPage(0) && $arItem["LINK"] != SITE_DIR):?>
			<a href="<?=$arItem["LINK"]?>" class="active"><?=$arItem["TEXT"]?></a>
		<?elseif($arItem["LINK"] == SITE_DIR):?>
			<a href="<?=$arItem["LINK"]?>"><?=$arItem["TEXT"]?></a>
		<?else:?>
			<span><?=$arItem["TEXT"]?></span>
		<?endif;?>
	<?else:?>
		<a href="<?=$arItem["LINK"]?>"><?=$arItem["TEXT"]?></a>
	<?endif?>
<?endforeach?>

<?endif?>
