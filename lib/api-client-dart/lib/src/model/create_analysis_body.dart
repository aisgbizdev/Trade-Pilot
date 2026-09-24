//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_analysis_body.g.dart';

/// CreateAnalysisBody
///
/// Properties:
/// * [instrument] 
/// * [timeframe] 
/// * [userInputContext] 
/// * [mode] 
@BuiltValue()
abstract class CreateAnalysisBody implements Built<CreateAnalysisBody, CreateAnalysisBodyBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'timeframe')
  CreateAnalysisBodyTimeframeEnum get timeframe;
  // enum timeframeEnum {  1m,  5m,  15m,  30m,  1h,  4h,  1D,  1W,  };

  @BuiltValueField(wireName: r'userInputContext')
  String? get userInputContext;

  @BuiltValueField(wireName: r'mode')
  CreateAnalysisBodyModeEnum get mode;
  // enum modeEnum {  beginner,  pro,  };

  CreateAnalysisBody._();

  factory CreateAnalysisBody([void updates(CreateAnalysisBodyBuilder b)]) = _$CreateAnalysisBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateAnalysisBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateAnalysisBody> get serializer => _$CreateAnalysisBodySerializer();
}

class _$CreateAnalysisBodySerializer implements PrimitiveSerializer<CreateAnalysisBody> {
  @override
  final Iterable<Type> types = const [CreateAnalysisBody, _$CreateAnalysisBody];

  @override
  final String wireName = r'CreateAnalysisBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateAnalysisBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'timeframe';
    yield serializers.serialize(
      object.timeframe,
      specifiedType: const FullType(CreateAnalysisBodyTimeframeEnum),
    );
    if (object.userInputContext != null) {
      yield r'userInputContext';
      yield serializers.serialize(
        object.userInputContext,
        specifiedType: const FullType(String),
      );
    }
    yield r'mode';
    yield serializers.serialize(
      object.mode,
      specifiedType: const FullType(CreateAnalysisBodyModeEnum),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateAnalysisBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateAnalysisBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'timeframe':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(CreateAnalysisBodyTimeframeEnum),
          ) as CreateAnalysisBodyTimeframeEnum;
          result.timeframe = valueDes;
          break;
        case r'userInputContext':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.userInputContext = valueDes;
          break;
        case r'mode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(CreateAnalysisBodyModeEnum),
          ) as CreateAnalysisBodyModeEnum;
          result.mode = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateAnalysisBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateAnalysisBodyBuilder();
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

class CreateAnalysisBodyTimeframeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'1m')
  static const CreateAnalysisBodyTimeframeEnum n1m = _$createAnalysisBodyTimeframeEnum_n1m;
  @BuiltValueEnumConst(wireName: r'5m')
  static const CreateAnalysisBodyTimeframeEnum n5m = _$createAnalysisBodyTimeframeEnum_n5m;
  @BuiltValueEnumConst(wireName: r'15m')
  static const CreateAnalysisBodyTimeframeEnum n15m = _$createAnalysisBodyTimeframeEnum_n15m;
  @BuiltValueEnumConst(wireName: r'30m')
  static const CreateAnalysisBodyTimeframeEnum n30m = _$createAnalysisBodyTimeframeEnum_n30m;
  @BuiltValueEnumConst(wireName: r'1h')
  static const CreateAnalysisBodyTimeframeEnum n1h = _$createAnalysisBodyTimeframeEnum_n1h;
  @BuiltValueEnumConst(wireName: r'4h')
  static const CreateAnalysisBodyTimeframeEnum n4h = _$createAnalysisBodyTimeframeEnum_n4h;
  @BuiltValueEnumConst(wireName: r'1D')
  static const CreateAnalysisBodyTimeframeEnum n1d = _$createAnalysisBodyTimeframeEnum_n1d;
  @BuiltValueEnumConst(wireName: r'1W')
  static const CreateAnalysisBodyTimeframeEnum n1w = _$createAnalysisBodyTimeframeEnum_n1w;

  static Serializer<CreateAnalysisBodyTimeframeEnum> get serializer => _$createAnalysisBodyTimeframeEnumSerializer;

  const CreateAnalysisBodyTimeframeEnum._(String name): super(name);

  static BuiltSet<CreateAnalysisBodyTimeframeEnum> get values => _$createAnalysisBodyTimeframeEnumValues;
  static CreateAnalysisBodyTimeframeEnum valueOf(String name) => _$createAnalysisBodyTimeframeEnumValueOf(name);
}

class CreateAnalysisBodyModeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'beginner')
  static const CreateAnalysisBodyModeEnum beginner = _$createAnalysisBodyModeEnum_beginner;
  @BuiltValueEnumConst(wireName: r'pro')
  static const CreateAnalysisBodyModeEnum pro = _$createAnalysisBodyModeEnum_pro;

  static Serializer<CreateAnalysisBodyModeEnum> get serializer => _$createAnalysisBodyModeEnumSerializer;

  const CreateAnalysisBodyModeEnum._(String name): super(name);

  static BuiltSet<CreateAnalysisBodyModeEnum> get values => _$createAnalysisBodyModeEnumValues;
  static CreateAnalysisBodyModeEnum valueOf(String name) => _$createAnalysisBodyModeEnumValueOf(name);
}

