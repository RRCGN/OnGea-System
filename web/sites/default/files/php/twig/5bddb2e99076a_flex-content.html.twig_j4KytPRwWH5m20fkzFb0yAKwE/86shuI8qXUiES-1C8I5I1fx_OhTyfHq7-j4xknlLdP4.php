<?php

/* @ongea_theme/components/flex-content.html.twig */
class __TwigTemplate_afcee9ff1be3e97cbbd3df8f781935281cfc1e019ab9ec2f1b03ec07615f9bd7 extends Twig_Template
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
        $tags = array("if" => 1, "set" => 8, "for" => 9);
        $filters = array("length" => 2, "t" => 6);
        $functions = array("path" => 10);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if', 'set', 'for'),
                array('length', 't'),
                array('path')
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
        if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "logo", array()), "url", array())) {
            // line 2
            echo "    <div class=\"-logo\" ";
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "logo", array()), "url", array())) > 3)) {
                echo " style=\"background: #fff url('";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "logo", array()), "url", array()), "html", null, true));
                echo "') no-repeat center; background-size: 100%;\" ";
            }
            echo " ></div>
";
        }
        // line 4
        if ($this->getAttribute(($context["data"] ?? null), "tags", array())) {
            // line 5
            echo "    <span class=\"ongea-tags text-right\">
        <p class=\"text-bold\">";
            // line 6
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Tags")));
            echo "</p>
        <p class=\"-tags\">
            ";
            // line 8
            $context["all"] = twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "tags", array()));
            // line 9
            echo "            ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? null), "tags", array()));
            foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                // line 10
                echo "                <a class=\"-link\" href=\"";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.taxonomy_term.canonical", array("taxonomy_term" => $this->getAttribute($context["value"], "target_id", array()))), "html", null, true));
                echo "\">
                    ";
                // line 11
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($context["value"], "entity", array()), "label", array()), "html", null, true));
                if ((($context["key"] + 1) < ($context["all"] ?? null))) {
                    echo ",";
                }
                // line 12
                echo "                </a> 
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 14
            echo "        </p>
    </span>
";
        }
        // line 17
        if ($this->getAttribute(($context["data"] ?? null), "project", array())) {
            // line 18
            echo "    <span class=\"ongea-project text-right\">
        <p class=\"text-bold\">";
            // line 19
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Project")));
            echo "</p>
        <p class=\"-tags\">
            ";
            // line 21
            $context["all"] = twig_length_filter($this->env, $this->getAttribute(($context["data"] ?? null), "project", array()));
            // line 22
            echo "            ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? null), "project", array()));
            foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                // line 23
                echo "                <a class=\"-link\" href=\"";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.node.canonical", array("node" => $this->getAttribute($context["value"], "target_id", array()))), "html", null, true));
                echo "\">
                    ";
                // line 24
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($context["value"], "entity", array()), "label", array()), "html", null, true));
                if ((($context["key"] + 1) < ($context["all"] ?? null))) {
                    echo ",";
                }
                // line 25
                echo "                </a> 
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 27
            echo "        </p>
    </span>
";
        }
        // line 30
        if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "author", array()), "id", array())) {
            // line 31
            echo "    <span class=\"ongea-author text-right\">
        <p class=\"text-bold pt\">";
            // line 32
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Author")));
            echo "</p>
        <p class=\"-author\">
            <a class=\"-link\" href=\"";
            // line 34
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.user.canonical", array("user" => $this->getAttribute($this->getAttribute(($context["data"] ?? null), "author", array()), "id", array()))), "html", null, true));
            echo "\">
                ";
            // line 35
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "author", array()), "name", array()), "html", null, true));
            echo "
            </a>
        </p>
    </span>
";
        }
        // line 40
        if ($this->getAttribute(($context["data"] ?? null), "left", array())) {
            // line 41
            echo "    ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["data"] ?? null), "left", array()));
            foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                // line 42
                echo "        ";
                if ((twig_length_filter($this->env, $context["value"]) > 0)) {
                    // line 43
                    echo "            <span class=\"ongea-left text-right\">
                <p class=\"text-bold pt\">";
                    // line 44
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t($context["key"])));
                    echo "</p>
                <p class=\"-left\">";
                    // line 45
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $context["value"], "html", null, true));
                    echo "</p>
            </span>
        ";
                }
                // line 48
                echo "    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
        }
        // line 50
        echo "
";
        // line 51
        if ($this->getAttribute(($context["data"] ?? null), "email", array())) {
            // line 52
            echo "    <span class=\"ongea-email text-right\">
        <p class=\"text-bold pt\">";
            // line 53
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Email address")));
            echo "</p>
        <p class=\"-mail\"><a href=\"mailto: ";
            // line 54
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "email", array()), "html", null, true));
            echo "\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["data"] ?? null), "email", array()), "html", null, true));
            echo "</a></p>
    </span>
";
        }
        // line 57
        echo "
";
        // line 59
        if ($this->getAttribute(($context["data"] ?? null), "about", array())) {
            // line 60
            echo "    <span class=\"about-span\">
        <h4 class=\"text-bold\">";
            // line 61
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("About")));
            echo "</h4>
        <span class=\"ongea-about text-right\">

            ";
            // line 64
            if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "permissions", array()), "name", array())) {
                echo " ";
            } else {
                // line 65
                echo "                ";
                if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "age", array())) > 0)) {
                    // line 66
                    echo "                    <p class=\"text-bold\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Age")));
                    echo "</p>
                    <p class=\"-about\">";
                    // line 67
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "age", array()), "html", null, true));
                    echo "</p>
                ";
                }
                // line 69
                echo "            ";
            }
            // line 70
            echo "
            ";
            // line 71
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "languages", array())) > 0)) {
                // line 72
                echo "                <p class=\"text-bold pt\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Languages")));
                echo "</p>
                ";
                // line 73
                $context["all"] = twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "languages", array()));
                // line 74
                echo "                ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "languages", array()));
                foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                    // line 75
                    echo "                    ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($context["value"], "entity", array()), "label", array()), "html", null, true));
                    if ((($context["key"] + 1) < ($context["all"] ?? null))) {
                        echo ",";
                    }
                    // line 76
                    echo "                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 77
                echo "            ";
            }
            // line 78
            echo "            
            ";
            // line 79
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "skills", array())) > 0)) {
                // line 80
                echo "                <p class=\"text-bold pt\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Skills")));
                echo "</p>
                ";
                // line 81
                $context["all"] = twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "skills", array()));
                // line 82
                echo "                ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["data"] ?? null), "about", array()), "skills", array()));
                foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                    // line 83
                    echo "                    <a class=\"-link\" href=\"";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.node.canonical", array("node" => $this->getAttribute($context["value"], "target_id", array()))), "html", null, true));
                    echo "\">
                        ";
                    // line 84
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($context["value"], "entity", array()), "label", array()), "html", null, true));
                    if ((($context["key"] + 1) < ($context["all"] ?? null))) {
                        echo ",";
                    }
                    // line 85
                    echo "                    </a> 
                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 87
                echo "            ";
            }
            // line 88
            echo "        </span>
    </span>

";
        }
        // line 92
        echo "
";
        // line 93
        if ($this->getAttribute(($context["data"] ?? null), "about", array())) {
            // line 94
            echo "    ";
            if ($this->getAttribute(($context["data"] ?? null), "contact", array())) {
                // line 95
                echo "        <span class=\"splitter\" style=\"width: 100%; height: 1px; margin-bottom: 1px solid #4d4d4d;\"></span>
    ";
            }
        }
        // line 98
        echo "
";
        // line 99
        if ($this->getAttribute(($context["data"] ?? null), "contact", array())) {
            // line 100
            echo "    <span class=\"contact-span\">
        <h4 class=\"text-bold\">";
            // line 101
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Contact")));
            echo "</h4>
        <span class=\"ongea-contact text-right\">
            ";
            // line 103
            if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "permissions", array()), "mail", array())) {
                echo " ";
            } else {
                // line 104
                echo "                ";
                if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "email", array())) > 0)) {
                    // line 105
                    echo "                    <p class=\"text-bold\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Email address")));
                    echo "</p>
                    <p class=\"-mail\"><a href=\"mailto: ";
                    // line 106
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "email", array()), "html", null, true));
                    echo "\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "email", array()), "html", null, true));
                    echo "</a></p>
                ";
                }
                // line 108
                echo "            ";
            }
            // line 109
            echo "
            ";
            // line 110
            if ($this->getAttribute($this->getAttribute(($context["data"] ?? null), "permissions", array()), "phone", array())) {
                echo " ";
            } else {
                // line 111
                echo "                ";
                if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "telephone", array())) > 0)) {
                    // line 112
                    echo "                    <p class=\"text-bold pt\">";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Telephone")));
                    echo "</p>
                    <p class=\"-telephone\">";
                    // line 113
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "telephone", array()), "html", null, true));
                    echo "</p>
                ";
                }
                // line 115
                echo "            ";
            }
            // line 116
            echo "
            ";
            // line 117
            if ((twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "website", array())) > 0)) {
                // line 118
                echo "                <p class=\"text-bold pt\">";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Website / Social link")));
                echo "</p>
                <p class=\"-website\">
                    <a href=\"";
                // line 120
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "website", array()), "url", array()), "html", null, true));
                echo "\" target=\"_blank\">
                        ";
                // line 121
                if ($this->getAttribute($this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "website", array()), "title", array())) {
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "website", array()), "title", array()), "html", null, true));
                    echo " ";
                } else {
                    echo " ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute($this->getAttribute($this->getAttribute(($context["data"] ?? null), "contact", array()), "website", array()), "url", array()), "html", null, true));
                    echo " ";
                }
                // line 122
                echo "                    </a>
                </p>
            ";
            }
            // line 125
            echo "        </span>
    </span>
";
        }
    }

    public function getTemplateName()
    {
        return "@ongea_theme/components/flex-content.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  415 => 125,  410 => 122,  400 => 121,  396 => 120,  390 => 118,  388 => 117,  385 => 116,  382 => 115,  377 => 113,  372 => 112,  369 => 111,  365 => 110,  362 => 109,  359 => 108,  352 => 106,  347 => 105,  344 => 104,  340 => 103,  335 => 101,  332 => 100,  330 => 99,  327 => 98,  322 => 95,  319 => 94,  317 => 93,  314 => 92,  308 => 88,  305 => 87,  298 => 85,  293 => 84,  288 => 83,  283 => 82,  281 => 81,  276 => 80,  274 => 79,  271 => 78,  268 => 77,  262 => 76,  256 => 75,  251 => 74,  249 => 73,  244 => 72,  242 => 71,  239 => 70,  236 => 69,  231 => 67,  226 => 66,  223 => 65,  219 => 64,  213 => 61,  210 => 60,  208 => 59,  205 => 57,  197 => 54,  193 => 53,  190 => 52,  188 => 51,  185 => 50,  178 => 48,  172 => 45,  168 => 44,  165 => 43,  162 => 42,  157 => 41,  155 => 40,  147 => 35,  143 => 34,  138 => 32,  135 => 31,  133 => 30,  128 => 27,  121 => 25,  116 => 24,  111 => 23,  106 => 22,  104 => 21,  99 => 19,  96 => 18,  94 => 17,  89 => 14,  82 => 12,  77 => 11,  72 => 10,  67 => 9,  65 => 8,  60 => 6,  57 => 5,  55 => 4,  45 => 2,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/components/flex-content.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/components/flex-content.html.twig");
    }
}
