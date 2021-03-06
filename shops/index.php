<?

define("MAIN_SHOPS", "Y");

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Салоны");
?><?$APPLICATION->IncludeComponent("bitrix:news.list", "news.list.shop", array(
	"IBLOCK_TYPE" => "lists",
	"IBLOCK_ID" => "1",
	"NEWS_COUNT" => "1000",
	"SORT_BY1" => "SORT",
	"SORT_ORDER1" => "ASC",
	"SORT_BY2" => "",
	"SORT_ORDER2" => "",
	"FILTER_NAME" => "",
	"FIELD_CODE" => array(
		0 => "ID",
		1 => "CODE",
		2 => "XML_ID",
		3 => "NAME",
		4 => "TAGS",
		5 => "SORT",
		6 => "PREVIEW_TEXT",
		7 => "PREVIEW_PICTURE",
		8 => "DETAIL_TEXT",
		9 => "DETAIL_PICTURE",
		10 => "DATE_ACTIVE_FROM",
		11 => "ACTIVE_FROM",
		12 => "DATE_ACTIVE_TO",
		13 => "ACTIVE_TO",
		14 => "SHOW_COUNTER",
		15 => "SHOW_COUNTER_START",
		16 => "IBLOCK_TYPE_ID",
		17 => "IBLOCK_ID",
		18 => "IBLOCK_CODE",
		19 => "IBLOCK_NAME",
		20 => "IBLOCK_EXTERNAL_ID",
		21 => "DATE_CREATE",
		22 => "CREATED_BY",
		23 => "CREATED_USER_NAME",
		24 => "TIMESTAMP_X",
		25 => "MODIFIED_BY",
		26 => "USER_NAME",
		27 => "",
	),
	"PROPERTY_CODE" => array(
		0 => "ADDRESS",
		1 => "PHONE",
		2 => "LOGO",
		3 => "SIDE_PIC",
		4 => "MAP_X",
		5 => "MAP_Y",
		6 => "MAP_ZOOM",
	),
	"CHECK_DATES" => "Y",
	"DETAIL_URL" => "",
	"AJAX_MODE" => "N",
	"AJAX_OPTION_JUMP" => "N",
	"AJAX_OPTION_STYLE" => "N",
	"AJAX_OPTION_HISTORY" => "N",
	"CACHE_TYPE" => "A",
	"CACHE_TIME" => "7200",
	"CACHE_FILTER" => "N",
	"CACHE_GROUPS" => "Y",
	"PREVIEW_TRUNCATE_LEN" => "",
	"ACTIVE_DATE_FORMAT" => "",
	"SET_STATUS_404" => "N",
	"SET_TITLE" => "N",
	"INCLUDE_IBLOCK_INTO_CHAIN" => "N",
	"ADD_SECTIONS_CHAIN" => "N",
	"HIDE_LINK_WHEN_NO_DETAIL" => "N",
	"PARENT_SECTION" => "",
	"PARENT_SECTION_CODE" => "",
	"INCLUDE_SUBSECTIONS" => "Y",
	"PAGER_TEMPLATE" => "modern",
	"DISPLAY_TOP_PAGER" => "N",
	"DISPLAY_BOTTOM_PAGER" => "N",
	"PAGER_TITLE" => "",
	"PAGER_SHOW_ALWAYS" => "N",
	"PAGER_DESC_NUMBERING" => "N",
	"PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
	"PAGER_SHOW_ALL" => "N",
	"AJAX_OPTION_ADDITIONAL" => ""
	),
	false
);?><br><?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>