<?php

/* themes/contrib/ongea_theme/templates/region/region--footer.html.twig */
class __TwigTemplate_3223f2d10642e49df579310b5b29ceeed0a76947e9a48597fe29d03e681e1088 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("set" => 2, "for" => 4, "if" => 5);
        $filters = array();
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('set', 'for', 'if'),
                array(),
                array()
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
        echo "
";
        // line 2
        $context["used"] = array(0 => "last_activities_block", 1 => "next_activities_block", 2 => "footer", 3 => "poweredby");
        // line 3
        echo "
";
        // line 4
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["elements"] ?? null));
        foreach ($context['_seq'] as $context["key"] => $context["value"]) {
            // line 5
            echo "    ";
            if (!twig_in_filter($context["key"], ($context["used"] ?? null))) {
                // line 6
                echo "        ";
                if (!twig_in_filter("#", $context["key"])) {
                    // line 7
                    echo "            ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $context["value"], "html", null, true));
                    echo "
        ";
                }
                // line 9
                echo "    ";
            }
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 11
        echo "
<section class=\"first-section\">
    <div class=\"container\">
        <div class=\"row\">
        <div class=\"col-sm-4 sm-down-hide\">
            <div class=\"-links f-left\">
            ";
        // line 17
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["elements"] ?? null), "last_activities_block", array()), "html", null, true));
        echo "
            </div>
        </div>
        <div class=\"col-sm-4\">
            <div class=\"-links f-center text-center\">
            ";
        // line 22
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["elements"] ?? null), "footer", array()), "html", null, true));
        echo "
            </div>
        </div>
        <div class=\"col-sm-4 sm-down-hide\">
            <div class=\"-links f-right text-right\">
            ";
        // line 27
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["elements"] ?? null), "next_activities_block", array()), "html", null, true));
        echo "
            </div>
        </div>
        </div>
    </div>
</section>

<section class=\"second-section\">
    <div class=\"-poweredby\">
        ";
        // line 36
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["elements"] ?? null), "poweredby", array()), "html", null, true));
        echo "
    </div>
</section>";
    }

    public function getTemplateName()
    {
        return "themes/contrib/ongea_theme/templates/region/region--footer.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  110 => 36,  98 => 27,  90 => 22,  82 => 17,  74 => 11,  67 => 9,  61 => 7,  58 => 6,  55 => 5,  51 => 4,  48 => 3,  46 => 2,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "themes/contrib/ongea_theme/templates/region/region--footer.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/region/region--footer.html.twig");
    }
}
