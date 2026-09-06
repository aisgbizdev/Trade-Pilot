//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_profile_body.g.dart';

/// UpdateProfileBody
///
/// Properties:
/// * [displayName] 
/// * [selectedMode] 
/// * [themePreference] 
/// * [onboardingCompleted] 
/// * [lang] - UI language preference — synced from the client so background dispatchers (e.g. weekly trader-mirror report) render notifications in the user's chosen language.
/// * [avatarUrl] - Object-storage path returned by the storage upload flow. Pass `null` to remove the current avatar.
@BuiltValue()
abstract class UpdateProfileBody implements Built<UpdateProfileBody, UpdateProfileBodyBuilder> {
  @BuiltValueField(wireName: r'displayName')
  String? get displayName;

  @BuiltValueField(wireName: r'selectedMode')
  UpdateProfileBodySelectedModeEnum? get selectedMode;
  // enum selectedModeEnum {  beginner,  pro,  };

  @BuiltValueField(wireName: r'themePreference')
  UpdateProfileBodyThemePreferenceEnum? get themePreference;
  // enum themePreferenceEnum {  light,  dark,  };

  @BuiltValueField(wireName: r'onboardingCompleted')
  bool? get onboardingCompleted;

  /// UI language preference — synced from the client so background dispatchers (e.g. weekly trader-mirror report) render notifications in the user's chosen language.
  @BuiltValueField(wireName: r'lang')
  UpdateProfileBodyLangEnum? get lang;
  // enum langEnum {  en,  id,  };

  /// Object-storage path returned by the storage upload flow. Pass `null` to remove the current avatar.
  @BuiltValueField(wireName: r'avatarUrl')
  String? get avatarUrl;

  UpdateProfileBody._();

  factory UpdateProfileBody([void updates(UpdateProfileBodyBuilder b)]) = _$UpdateProfileBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateProfileBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateProfileBody> get serializer => _$UpdateProfileBodySerializer();
}

class _$UpdateProfileBodySerializer implements PrimitiveSerializer<UpdateProfileBody> {
  @override
  final Iterable<Type> types = const [UpdateProfileBody, _$UpdateProfileBody];

  @override
  final String wireName = r'UpdateProfileBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateProfileBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.displayName != null) {
      yield r'displayName';
      yield serializers.serialize(
        object.displayName,
        specifiedType: const FullType(String),
      );
    }
    if (object.selectedMode != null) {
      yield r'selectedMode';
      yield serializers.serialize(
        object.selectedMode,
        specifiedType: const FullType(UpdateProfileBodySelectedModeEnum),
      );
    }
    if (object.themePreference != null) {
      yield r'themePreference';
      yield serializers.serialize(
        object.themePreference,
        specifiedType: const FullType(UpdateProfileBodyThemePreferenceEnum),
      );
    }
    if (object.onboardingCompleted != null) {
      yield r'onboardingCompleted';
      yield serializers.serialize(
        object.onboardingCompleted,
        specifiedType: const FullType(bool),
      );
    }
    if (object.lang != null) {
      yield r'lang';
      yield serializers.serialize(
        object.lang,
        specifiedType: const FullType(UpdateProfileBodyLangEnum),
      );
    }
    if (object.avatarUrl != null) {
      yield r'avatarUrl';
      yield serializers.serialize(
        object.avatarUrl,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    UpdateProfileBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateProfileBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'displayName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.displayName = valueDes;
          break;
        case r'selectedMode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UpdateProfileBodySelectedModeEnum),
          ) as UpdateProfileBodySelectedModeEnum?;
          if (valueDes == null) continue;
          result.selectedMode = valueDes;
          break;
        case r'themePreference':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UpdateProfileBodyThemePreferenceEnum),
          ) as UpdateProfileBodyThemePreferenceEnum?;
          if (valueDes == null) continue;
          result.themePreference = valueDes;
          break;
        case r'onboardingCompleted':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.onboardingCompleted = valueDes;
          break;
        case r'lang':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UpdateProfileBodyLangEnum),
          ) as UpdateProfileBodyLangEnum?;
          if (valueDes == null) continue;
          result.lang = valueDes;
          break;
        case r'avatarUrl':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.avatarUrl = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  UpdateProfileBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateProfileBodyBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class UpdateProfileBodySelectedModeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'beginner')
  static const UpdateProfileBodySelectedModeEnum beginner = _$updateProfileBodySelectedModeEnum_beginner;
  @BuiltValueEnumConst(wireName: r'pro')
  static const UpdateProfileBodySelectedModeEnum pro = _$updateProfileBodySelectedModeEnum_pro;

  static Serializer<UpdateProfileBodySelectedModeEnum> get serializer => _$updateProfileBodySelectedModeEnumSerializer;

  const UpdateProfileBodySelectedModeEnum._(String name): super(name);

  static BuiltSet<UpdateProfileBodySelectedModeEnum> get values => _$updateProfileBodySelectedModeEnumValues;
  static UpdateProfileBodySelectedModeEnum valueOf(String name) => _$updateProfileBodySelectedModeEnumValueOf(name);
}

class UpdateProfileBodyThemePreferenceEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'light')
  static const UpdateProfileBodyThemePreferenceEnum light = _$updateProfileBodyThemePreferenceEnum_light;
  @BuiltValueEnumConst(wireName: r'dark')
  static const UpdateProfileBodyThemePreferenceEnum dark = _$updateProfileBodyThemePreferenceEnum_dark;

  static Serializer<UpdateProfileBodyThemePreferenceEnum> get serializer => _$updateProfileBodyThemePreferenceEnumSerializer;

  const UpdateProfileBodyThemePreferenceEnum._(String name): super(name);

  static BuiltSet<UpdateProfileBodyThemePreferenceEnum> get values => _$updateProfileBodyThemePreferenceEnumValues;
  static UpdateProfileBodyThemePreferenceEnum valueOf(String name) => _$updateProfileBodyThemePreferenceEnumValueOf(name);
}

class UpdateProfileBodyLangEnum extends EnumClass {

  /// UI language preference — synced from the client so background dispatchers (e.g. weekly trader-mirror report) render notifications in the user's chosen language.
  @BuiltValueEnumConst(wireName: r'en')
  static const UpdateProfileBodyLangEnum en = _$updateProfileBodyLangEnum_en;
  /// UI language preference — synced from the client so background dispatchers (e.g. weekly trader-mirror report) render notifications in the user's chosen language.
  @BuiltValueEnumConst(wireName: r'id')
  static const UpdateProfileBodyLangEnum id = _$updateProfileBodyLangEnum_id;

  static Serializer<UpdateProfileBodyLangEnum> get serializer => _$updateProfileBodyLangEnumSerializer;

  const UpdateProfileBodyLangEnum._(String name): super(name);

  static BuiltSet<UpdateProfileBodyLangEnum> get values => _$updateProfileBodyLangEnumValues;
  static UpdateProfileBodyLangEnum valueOf(String name) => _$updateProfileBodyLangEnumValueOf(name);
}

