//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'recent_instruments_instruments_inner.g.dart';

/// RecentInstrumentsInstrumentsInner
///
/// Properties:
/// * [instrument] 
/// * [lastAnalyzedAt] 
/// * [mode] 
@BuiltValue()
abstract class RecentInstrumentsInstrumentsInner implements Built<RecentInstrumentsInstrumentsInner, RecentInstrumentsInstrumentsInnerBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'lastAnalyzedAt')
  DateTime get lastAnalyzedAt;

  @BuiltValueField(wireName: r'mode')
  String get mode;

  RecentInstrumentsInstrumentsInner._();

  factory RecentInstrumentsInstrumentsInner([void updates(RecentInstrumentsInstrumentsInnerBuilder b)]) = _$RecentInstrumentsInstrumentsInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RecentInstrumentsInstrumentsInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RecentInstrumentsInstrumentsInner> get serializer => _$RecentInstrumentsInstrumentsInnerSerializer();
}

class _$RecentInstrumentsInstrumentsInnerSerializer implements PrimitiveSerializer<RecentInstrumentsInstrumentsInner> {
  @override
  final Iterable<Type> types = const [RecentInstrumentsInstrumentsInner, _$RecentInstrumentsInstrumentsInner];

  @override
  final String wireName = r'RecentInstrumentsInstrumentsInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RecentInstrumentsInstrumentsInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'lastAnalyzedAt';
    yield serializers.serialize(
      object.lastAnalyzedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'mode';
    yield serializers.serialize(
      object.mode,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    RecentInstrumentsInstrumentsInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RecentInstrumentsInstrumentsInnerBuilder result,
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
        case r'lastAnalyzedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.lastAnalyzedAt = valueDes;
          break;
        case r'mode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
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
  RecentInstrumentsInstrumentsInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RecentInstrumentsInstrumentsInnerBuilder();
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

