//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'instrument_request_receipt.g.dart';

/// InstrumentRequestReceipt
///
/// Properties:
/// * [code] 
/// * [recorded] 
@BuiltValue()
abstract class InstrumentRequestReceipt implements Built<InstrumentRequestReceipt, InstrumentRequestReceiptBuilder> {
  @BuiltValueField(wireName: r'code')
  String get code;

  @BuiltValueField(wireName: r'recorded')
  bool get recorded;

  InstrumentRequestReceipt._();

  factory InstrumentRequestReceipt([void updates(InstrumentRequestReceiptBuilder b)]) = _$InstrumentRequestReceipt;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(InstrumentRequestReceiptBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<InstrumentRequestReceipt> get serializer => _$InstrumentRequestReceiptSerializer();
}

class _$InstrumentRequestReceiptSerializer implements PrimitiveSerializer<InstrumentRequestReceipt> {
  @override
  final Iterable<Type> types = const [InstrumentRequestReceipt, _$InstrumentRequestReceipt];

  @override
  final String wireName = r'InstrumentRequestReceipt';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    InstrumentRequestReceipt object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(String),
    );
    yield r'recorded';
    yield serializers.serialize(
      object.recorded,
      specifiedType: const FullType(bool),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    InstrumentRequestReceipt object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required InstrumentRequestReceiptBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.code = valueDes;
          break;
        case r'recorded':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.recorded = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  InstrumentRequestReceipt deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = InstrumentRequestReceiptBuilder();
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

