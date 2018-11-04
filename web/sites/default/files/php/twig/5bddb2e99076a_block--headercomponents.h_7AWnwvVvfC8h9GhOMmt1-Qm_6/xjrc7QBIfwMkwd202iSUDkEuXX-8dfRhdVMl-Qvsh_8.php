<?php

/* themes/contrib/ongea_theme/templates/block/block--headercomponents.html.twig */
class __TwigTemplate_b498930a7988700db35c56593063387cfa56aadd322e799f32c49856fc8269d0 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
            'content' => array($this, 'block_content'),
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("block" => 4, "set" => 6, "if" => 19);
        $filters = array("length" => 19);
        $functions = array("file_url" => 10, "url" => 20);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('block', 'set', 'if'),
                array('length'),
                array('file_url', 'url')
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 1
        echo "<div";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["attributes"] ?? null), "html", null, true));
        echo ">
    ";
        // line 2
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_prefix"] ?? null), "html", null, true));
        echo "
    ";
        // line 3
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_suffix"] ?? null), "html", null, true));
        echo "
    ";
        // line 4
        $this->displayBlock('content', $context, $blocks);
        // line 32
        echo "</div>

";
    }

    // line 4
    public function block_content($context, array $blocks = array())
    {
        // line 5
        echo "
        ";
        // line 6
        $context["block_data"] = array("title" =>         // line 7
($context["site_name"] ?? null), "subtitle" =>         // line 8
($context["site_slogan"] ?? null), "image" => array("url" => call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 10
($context["content"] ?? null), "field_header_image", array()), "#object", array(), "array"), "field_header_image", array()), "entity", array()), "uri", array()), "value", array()))), "alt" => $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 11
($context["content"] ?? null), "field_header_image", array()), "#object", array(), "array"), "field_header_image", array()), "alt", array())), "logo" => array("url" => call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 14
($context["content"] ?? null), "field_header_logo", array()), "#object", array(), "array"), "field_header_logo", array()), "entity", array()), "uri", array()), "value", array()))), "alt" => $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 15
($context["content"] ?? null), "field_header_logo", array()), "#object", array(), "array"), "field_header_logo", array()), "alt", array())));
        // line 18
        echo "
        <div class=\"banner\" ";
        // line 19
        if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["block_data"] ?? null), "image", array()), "url", array())) > 3)) {
            echo " style=\"background: url('";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["block_data"] ?? null), "image", array()), "url", array()), "html", null, true));
            echo "'); background-size: cover;\" ";
        }
        echo ">
            <a href=\"";
        // line 20
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->env->getExtension('Drupal\Core\Template\TwigExtension')->getUrl("<front>")));
        echo "\">
                <div class=\"-logo\" ";
        // line 21
        if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["block_data"] ?? null), "logo", array()), "url", array())) > 3)) {
            echo " style=\"background: #fff url('";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["block_data"] ?? null), "logo", array()), "url", array()), "html", null, true));
            echo "') no-repeat center; background-size: 75%;\" ";
        }
        echo "></div>
            </a>
            <div class=\"-titles\">
                <h2 class=\"-title\">";
        // line 24
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["block_data"] ?? null), "title", array()), "html", null, true));
        echo "</h2>
                <p class=\"-subtitle\">";
        // line 25
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["block_data"] ?? null), "subtitle", array()), "html", null, true));
        echo "</p>
            </div>
        </div>

        ";
        // line 30
        echo "
    ";
    }

    public function getTemplateName()
    {
        return "themes/contrib/ongea_theme/templates/block/block--headercomponents.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  115 => 30,  108 => 25,  104 => 24,  94 => 21,  90 => 20,  82 => 19,  79 => 18,  77 => 15,  76 => 14,  75 => 11,  74 => 10,  73 => 8,  72 => 7,  71 => 6,  68 => 5,  65 => 4,  59 => 32,  57 => 4,  53 => 3,  49 => 2,  44 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "themes/contrib/ongea_theme/templates/block/block--headercomponents.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/block/block--headercomponents.html.twig");
    }
}
